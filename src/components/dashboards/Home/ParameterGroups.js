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
import ConfigurationService from "../../../services/ConfigurationService";
import ParameterGroupService from "../../../services/ParameterGroupService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const ParameterGroups = () => {
  const [configurationName, setConfigurationName] = useState("");
  const [parameterName, setParameterName] = useState("");
  const [filter, setFilter] = useState("");
  const [configurationParameters, setConfigurationParameters] = useState([]);
  const [parameterGroups, setParameterGroups] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [waitResponse, setWaitResponse] = useState(false);

  useEffect(() => {
    const fetchConfigurationNames = async () => {
      try {
        const configurations =
          await ConfigurationService.getConfigurationList();
        const parameters = configurations.map(
          (config) => config.configurationParameter
        );
        setConfigurationParameters(parameters);
      } catch (error) {
        toast.error("Konfigürasyon parametreleri alınamadı.");
      }
    };

    const fetchParameterGroups = async () => {
      try {
        setWaitResponse(true);
        const groups = await ParameterGroupService.getParameterGroupList();
        setParameterGroups(groups);
      } catch (error) {
        toast.error("Parametre grupları alınamadı.");
      } finally {
        setWaitResponse(false);
      }
    };

    fetchConfigurationNames();
    fetchParameterGroups();
  }, []);

  const handleAdd = async () => {
    if (configurationName && parameterName) {
      const newItem = {
        parameterId: uuidv4(),
        configurationParameter: configurationName,
        parameterName: parameterName,
      };

      try {
        const createdItem = await ParameterGroupService.createParameterGroup(
          newItem
        );
        setParameterGroups([...parameterGroups, createdItem]);
        setConfigurationName("");
        setParameterName("");
        toast.success("Parametre grubu başarıyla eklendi.");
      } catch (error) {
        toast.error("Parametre grubu eklenirken bir hata oluştu.");
      }
    }
  };

  const handleEdit = async (item) => {
    try {
      await ParameterGroupService.updateParameterGroup(item.parameterId, item);
      setEditItem(item);
      setConfigurationName(item.configurationParameter);
      setParameterName(item.parameterName);
      setShowModal(true);
      toast.success("Düzenleme işlemi başarıyla tamamlandı.");
    } catch (error) {
      toast.error("Düzenleme işlemi başarısız oldu.");
    }
  };

  const handleUpdate = async () => {
    if (editItem && configurationName && parameterName) {
      const updatedItem = {
        ...editItem,
        configurationParameter: configurationName,
        parameterName: parameterName,
      };

      try {
        await ParameterGroupService.updateParameterGroup(
          updatedItem.parameterId,
          updatedItem
        );
        setParameterGroups(
          parameterGroups.map((item) =>
            item.parameterId === updatedItem.parameterId ? updatedItem : item
          )
        );
        setEditItem(null);
        setConfigurationName("");
        setParameterName("");
        setShowModal(false);
        toast.success("Düzenleme işlemi başarılı.");
      } catch (error) {
        toast.error("Düzenleme işlemi başarısız oldu.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await ParameterGroupService.deleteParameterGroup(id);
      setParameterGroups(
        parameterGroups.filter((item) => item.parameterId !== id)
      );
      toast.success(
        "Parametre grubu başarıyla silindi, lütfen kontrollerinizi yapınız."
      );
    } catch (error) {
      toast.error("Parametre grubu silinirken bir hata oluştu.");
    }
  };

  const filteredItems = parameterGroups.filter(
    (item) =>
      (item.configurationParameter || "")
        .toLowerCase()
        .includes(filter.toLowerCase()) ||
      (item.parameterName || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card className="w-100">
      <Card.Header className="text-warning display-6">
        Parametre Grupları
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Konfigürasyon Parametresi</Form.Label>
            <Form.Control
              as="select"
              className="w-75"
              value={configurationName}
              onChange={(e) => setConfigurationName(e.target.value)}
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
              type="text"
              placeholder="Parametre adını gir"
              className="w-75"
              value={parameterName}
              onChange={(e) => setParameterName(e.target.value)}
            />
          </Form.Group>
          <Button variant="warning w-25" onClick={handleAdd}>
            Ekle
          </Button>
        </Form>
        <hr className="my-4" />
        <Form.Group className="mb-3">
          <InputGroup className="w-25">
            <FormControl
              placeholder="Filter..."
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
                <th>Configuration Name</th>
                <th>Parameter Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.configurationParameter}</td>
                    <td>{item.parameterName}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(item)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="danger"
                        className="ms-2"
                        onClick={() => handleDelete(item.parameterId)}
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center" colSpan="4">
                    Veri Bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Parameter Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Configuration Parameter</Form.Label>
              <Form.Control
                as="select"
                value={configurationName}
                onChange={(e) => setConfigurationName(e.target.value)}
              >
                <option value="">Select a configuration</option>
                {configurationParameters.map((parameter, index) => (
                  <option key={index} value={parameter}>
                    {parameter}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parameter Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter parameter name"
                value={parameterName}
                onChange={(e) => setParameterName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdate}>
              Düzenle
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default ParameterGroups;
