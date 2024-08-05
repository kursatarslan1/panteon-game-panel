import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  InputGroup,
  FormControl,
  Table,
  Spinner,
  Modal,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfigurationService from "services/ConfigurationService";
import { v4 as uuidv4 } from "uuid";

const Configuration = () => {
  const navigate = useNavigate();
  const [configurationName, setConfigurationName] = useState("");
  const [configurationParameter, setConfigurationParameter] = useState("");
  const [filter, setFilter] = useState("");
  const [configurationList, setConfigurationList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editConfig, setEditConfig] = useState({
    configurationId: "",
    configurationName: "",
    configurationParameter: "",
  });
  const [waitResponse, setWaitResponse] = useState(false);

  useEffect(() => {
    const fetchManagerInformation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/authentication/simple/login");
          return;
        }
      } catch (error) {
        toast.error("Kullanıcı bilgileri alınamadı.");
      }
    };

    fetchManagerInformation();
  }, [navigate]);

  const fetchConfigurations = async () => {
    try {
      setWaitResponse(true);
      const response = await ConfigurationService.getConfigurationList();
      setConfigurationList(response);
    } catch (error) {
      toast.error("Konfigürasyon parametreleri alınırken bir hata oluştu.");
    } finally {
      setWaitResponse(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const handleAdd = async () => {
    if (configurationName && configurationParameter) {
      const newConfiguration = {
        configurationId: uuidv4(),
        configurationName: configurationName,
        configurationParameter: configurationParameter,
      };
      try {
        await ConfigurationService.createConfiguration(newConfiguration);
        setConfigurationList([...configurationList, newConfiguration]);
        setConfigurationName("");
        setConfigurationParameter("");
        fetchConfigurations();
        toast.success("Ana konfigürasyon parametre kaydı başarıyla eklendi.");
      } catch (error) {
        toast.error(
          "Ana konfigürasyon parametresi eklenirken bir hata oluştu."
        );
      }
    }
  };

  const handleEdit = async () => {
    try {
      await ConfigurationService.updateConfiguration(
        editConfig.configurationId,
        editConfig
      );
      setConfigurationList(
        configurationList.map((item) =>
          item.configurationId === editConfig.configurationId
            ? editConfig
            : item
        )
      );
      setShowEditModal(false);
      toast.success("Düzenleme işlemi başarılı.");
    } catch (error) {
      toast.error("Düzenleme kaydı başarısız oldu.");
    }
  };

  const handleDelete = async (configurationId) => {
    try {
      await ConfigurationService.deleteConfiguration(configurationId);
      setConfigurationList(
        configurationList.filter(
          (item) => item.configurationId !== configurationId
        )
      );
      toast.success(
        "Ana konfigürasyon parametre kaydı silindi, lütfen kontrollerinizi tamamlayınız."
      );
    } catch (error) {
      toast.error("Ana konfigürasyon parametresi silinirken bir hata oluştu.");
    }
  };

  const openEditModal = (item) => {
    setEditConfig(item);
    setShowEditModal(true);
  };

  const filteredItems = configurationList.filter(
    (item) =>
      item.configurationName.toLowerCase().includes(filter.toLowerCase()) ||
      item.configurationParameter.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Card>
        <Card.Header className="text-warning display-6">
          Ana Konfigürasyon Parametreleri
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={4}>
                Konfigürasyon Adı:
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Konfigürasyon adını gir"
                className="m-2 mb-0 mt-0 w-75"
                value={configurationName}
                onChange={(e) => setConfigurationName(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={4}>
                Konfigürasyon Parametresi:
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Konfigürasyon parametresini gir"
                className="m-2 mb-0 mt-0 w-75"
                value={configurationParameter}
                onChange={(e) => setConfigurationParameter(e.target.value)}
              />
            </Form.Group>
            <Button variant="warning w-25" onClick={handleAdd}>
              Ekle
            </Button>
          </Form>
          <hr className="my-4" />
          <Form.Group className="mb-3 w-25">
            <InputGroup>
              <FormControl
                placeholder="Filtrele..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
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
                  <th>Konfigürasyon Adı</th>
                  <th>Konfigürasyon Parametresi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.configurationName}</td>
                      <td>{item.configurationParameter}</td>
                      <td>
                        <Button
                          variant="warning"
                          className="m-1 w-auto"
                          onClick={() => openEditModal(item)}
                        >
                          Düzenle
                        </Button>
                        <Button
                          variant="danger"
                          className="m-1 w-auto"
                          onClick={() => handleDelete(item.configurationId)}
                        >
                          Sil
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Veri Bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfigürasyonu Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Konfigürasyon Adı</Form.Label>
              <Form.Control
                type="text"
                value={editConfig.configurationName}
                onChange={(e) =>
                  setEditConfig({
                    ...editConfig,
                    configurationName: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Konfigürasyon Parametresi</Form.Label>
              <Form.Control
                type="text"
                value={editConfig.configurationParameter}
                onChange={(e) =>
                  setEditConfig({
                    ...editConfig,
                    configurationParameter: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Kapat
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Configuration;
