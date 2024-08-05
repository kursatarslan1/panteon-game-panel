import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  InputGroup,
  FormControl,
  Table,
  Spinner,
  Modal,
} from "react-bootstrap";
import ParameterDefinitionService from "../../../services/ParameterDefinitionService";
import ConfigurationService from "../../../services/ConfigurationService";
import ParameterGroupService from "../../../services/ParameterGroupService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const ParameterDefinitions = () => {
  const [showModal, setShowModal] = useState(false);
  const [parameterName, setParameterName] = useState("");
  const [parameterOptions, setParameterOptions] = useState("");
  const [parameterValue, setParameterValue] = useState("");
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState([]);
  const [configurationName, setConfigurationName] = useState("");
  const [configurationParameters, setConfigurationParameters] = useState([]);
  const [parameterNames, setParameterNames] = useState([]);
  const [waitResponse, setWait] = useState(false);

  useEffect(() => {
    const fetchParameterDefinitions = async () => {
      try {
        setWait(true);
        const data =
          await ParameterDefinitionService.getParameterDefinitionList();
        setItems(data);
      } catch (error) {
        toast.error("Parametre tanım kayıtları alınırken bir hata oluştu.");
      } finally {
        setWait(false);
      }
    };

    const fetchConfigurationNames = async () => {
      try {
        const configurations =
          await ConfigurationService.getConfigurationList();
        const parameters = configurations.map(
          (config) => config.configurationParameter
        );
        setConfigurationParameters(parameters);
      } catch (error) {
        toast.error(
          "Ana konfigürasyon parametreleri alınırken bir hata oluştu."
        );
      }
    };

    fetchParameterDefinitions();
    fetchConfigurationNames();
  }, []);

  const handleAdd = async () => {
    if (parameterName && parameterOptions && parameterValue) {
      const newItem = {
        id: {},
        definitionId: uuidv4(),
        parameterName,
        parameterOptions,
        parameterValue,
      };

      try {
        const createdItem =
          await ParameterDefinitionService.createParameterDefinition(newItem);
        setItems([...items, createdItem]);
        setParameterName("");
        setParameterOptions("");
        setParameterValue("");
        setShowModal(false);
        toast.success("Parametre tanımı başarıyla eklendi.");
      } catch (error) {
        toast.error("Parametre tanımı eklenemedi.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await ParameterDefinitionService.deleteParameterDefinition(id);
      setItems(items.filter((item) => item.definitionId !== id));
      toast.success(
        "Parametre tanımı silindi, lütfen kontrollerinizi yapınız."
      );
    } catch (error) {
      toast.error("Parametre tanımı silinemedi.");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.parameterName.toLowerCase().includes(filter.toLowerCase()) ||
      item.parameterOptions.toLowerCase().includes(filter.toLowerCase()) ||
      item.parameterValue.toLowerCase().includes(filter.toLowerCase())
  );

  const handleChangeConfigurationName = async (e) => {
    const selectedConfigurationName = e.target.value;

    if (selectedConfigurationName === "") {
      setConfigurationName("");
      setParameterNames([]);
      return;
    }

    setConfigurationName(selectedConfigurationName);
    setParameterNames([]);

    try {
      const response =
        await ParameterGroupService.getParameterNamesByConfigurationName(
          selectedConfigurationName
        );
      setParameterNames(response);
    } catch (error) {
      toast.error(
        "İlgili konfigürasyon parametrelerine bağlı parametre grupları alınamadı."
      );
    }
  };

  const handleChangeParameterName = (e) => {
    setParameterName(e.target.value);
  };

  return (
    <>
      <Card>
        <Card.Header className="text-warning display-6">
          Parametre Tanımları
        </Card.Header>
        <Card.Body>
          <Button variant="warning" onClick={() => setShowModal(true)}>
            Yeni Parametre Ekle
          </Button>
          <hr className="my-4" />
          <Form.Group className="mb-3">
            <InputGroup className="w-25">
              <FormControl
                placeholder="Filtrele..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
          {/* Tablo Başlıkları */}
          {waitResponse ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </Spinner>
              <p>Yükleniyor...</p>
            </div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Parametre Adı</th>
                  <th>Parametre Seçeneği</th>
                  <th>Parametre Değeri</th>
                  <th>Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.parameterName}</td>
                      <td>{item.parameterOptions}</td>
                      <td>{item.parameterValue}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(item.definitionId)}
                          className="w-auto"
                        >
                          Sil
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Veri bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-warning">
            Yeni Parametre Ekle
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Konfigürasyon Adı</Form.Label>
              <Form.Control
                as="select"
                value={configurationName}
                onChange={(e) => handleChangeConfigurationName(e)}
              >
                <option value="">Konfigürasyon Seç</option>
                {configurationParameters.map((parameter, index) => (
                  <option key={index} value={parameter}>
                    {parameter}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parametre Adı</Form.Label>
              <Form.Control
                as="select"
                value={parameterName}
                onChange={(e) => handleChangeParameterName(e)}
              >
                <option value="">Parametre Seç</option>
                {parameterNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parametre Seçeneği</Form.Label>
              <Form.Control
                type="text"
                placeholder="Parametre seçeneğini gir"
                value={parameterOptions}
                onChange={(e) => setParameterOptions(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parameter Değeri</Form.Label>
              <Form.Control
                type="text"
                placeholder="Parametre değerini gir"
                value={parameterValue}
                onChange={(e) => setParameterValue(e.target.value)}
              />
            </Form.Group>
            <Button variant="warning w-25" onClick={handleAdd}>
              Ekle
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ParameterDefinitions;
