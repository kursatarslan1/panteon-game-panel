import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  FormControl,
  InputGroup,
  Modal,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import ParameterDefinitionService from "services/ParameterDefinitionService";
import BuildingConfigurationService from "services/BuildingConfigurationService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import Flex from "components/common/Flex";

const BuildingParameters = () => {
  const [filter, setFilter] = useState("");
  const [buildingConfigurations, setBuildingConfigurations] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [newBuildingType, setNewBuildingType] = useState("");
  const [newBuildingCost, setNewBuildingCost] = useState("");
  const [newConstructionTime, setNewConstructionTime] = useState("");

  const [waitResponse, setWaitResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBuildingConfigurations = async () => {
    setWaitResponse(true);
    try {
      const response =
        await BuildingConfigurationService.getBuildingConfigurationList();
      setBuildingConfigurations(response);
    } catch (error) {
      setErrorMessage(error.message || "Veriler alınırken bir hata oluştu");
    } finally {
      setWaitResponse(false);
    }
  };

  useEffect(() => {
    fetchBuildingConfigurations();
  }, []);

  useEffect(() => {
    const fetchBuildingTypes = async () => {
      try {
        const response =
          await ParameterDefinitionService.getParameterValuesByParameterNames(
            "BuildingType"
          );
        const existingBuildingTypes = buildingConfigurations.map(
          (item) => item.buildingType
        );
        const filteredBuildingTypes = response.filter(
          (type) => !existingBuildingTypes.includes(type)
        );
        setBuildingTypes(filteredBuildingTypes);
      } catch (error) {
        setErrorMessage("Building types could not be fetched");
      }
    };

    fetchBuildingTypes();
  }, [buildingConfigurations]);

  const handleAdd = async () => {
    if (newBuildingType && newBuildingCost && newConstructionTime) {
      const newItem = {
        buildingId: uuidv4(),
        buildingType: newBuildingType,
        buildingCost: newBuildingCost,
        constructionTime: newConstructionTime,
      };

      try {
        const response =
          await BuildingConfigurationService.createBuildingConfiguration(
            newItem
          );
        setBuildingConfigurations([...buildingConfigurations, response]);
        setShowModal(false);
        resetForm();
        toast.success("Konfigürasyon tanımı başarılı.");
      } catch (error) {
        // setErrorMessage(
        //   "New building configuration could not be added: " + error.message
        // );
        toast.error(
          "BuildingCost > 0 ve 30 < ConstructionTime < 1800 olmalıdır."
        );
      }
    } else {
      setErrorMessage("All fields are required");
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = buildingConfigurations.find(
      (item) => item.buildingId === id
    );
    if (itemToEdit) {
      setNewBuildingType(itemToEdit.buildingType);
      setNewBuildingCost(itemToEdit.buildingCost);
      setNewConstructionTime(itemToEdit.constructionTime);
      setEditItemId(id);
      setIsEdit(true);
      setShowModal(true);
    }
  };

  const handleUpdate = async () => {
    if (
      newBuildingType &&
      newBuildingCost &&
      newConstructionTime &&
      editItemId
    ) {
      const updatedItem = {
        buildingId: editItemId,
        buildingType: newBuildingType,
        buildingCost: newBuildingCost,
        constructionTime: newConstructionTime,
      };

      try {
        const response =
          await BuildingConfigurationService.updateBuildingConfiguration(
            editItemId,
            updatedItem
          );
        setBuildingConfigurations(
          buildingConfigurations.map((item) =>
            item.buildingId === editItemId ? response : item
          )
        );
        setShowModal(false);
        resetForm();
      } catch (error) {
        setErrorMessage(
          "Building configuration could not be updated: " + error.message
        );
      }
    } else {
      setErrorMessage("All fields are required");
    }
  };

  const handleDelete = async (id) => {
    try {
      await BuildingConfigurationService.deleteBuildingConfiguration(id);
      setBuildingConfigurations(
        buildingConfigurations.filter((item) => item.buildingId !== id)
      );
    } catch (error) {
      setErrorMessage(
        "Building configuration could not be deleted: " + error.message
      );
    }
  };

  const filteredItems = buildingConfigurations.filter(
    (item) =>
      (item.buildingType
        ? item.buildingType.toLowerCase().includes(filter.toLowerCase())
        : false) ||
      (item.buildingCost
        ? item.buildingCost.toLowerCase().includes(filter.toLowerCase())
        : false) ||
      (item.constructionTime
        ? item.constructionTime.toLowerCase().includes(filter.toLowerCase())
        : false)
  );

  const handleBuildingChange = (e) => {
    setNewBuildingType(e.target.value);
  };

  const resetForm = () => {
    setNewBuildingType("");
    setNewBuildingCost("");
    setNewConstructionTime("");
    setIsEdit(false);
    setEditItemId(null);
  };

  return (
    <>
      <Card>
        <Card.Header className="header">
          <Flex justifyContent="between">
            <span className="text-warning display-6">
              Building Configurations
            </span>
            <Button
              variant="warning"
              onClick={() => {
                setShowModal(true);
                resetForm();
              }}
            >
              Yeni Build Parametresi Ekle
            </Button>
          </Flex>
        </Card.Header>
        <Card.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <InputGroup className="mb-3 w-25">
            <FormControl
              placeholder="Filtrele..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </InputGroup>

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
                  <th>BuildingType</th>
                  <th>BuildingCost</th>
                  <th>ConstructionTime</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.buildingId}>
                      <td>{item.buildingType}</td>
                      <td>{item.buildingCost} gold</td>
                      <td>{item.constructionTime} second</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleEdit(item.buildingId)}
                          className="me-2"
                        >
                          Düzenle
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(item.buildingId)}
                        >
                          Sil
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data available
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
            {isEdit
              ? "Build Parametresini Düzenle"
              : "Yeni Build Parametresi Ekle"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>BuildingType</Form.Label>
              <Form.Control
                as="select"
                value={newBuildingType}
                onChange={(e) => handleBuildingChange(e)}
              >
                <option value="">BuildingType seç...</option>
                {buildingTypes &&
                  buildingTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Building Cost</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter building cost"
                value={newBuildingCost}
                onChange={(e) => setNewBuildingCost(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Construction Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter construction time"
                value={newConstructionTime}
                onChange={(e) => setNewConstructionTime(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="w-auto"
            onClick={() => setShowModal(false)}
          >
            İptal
          </Button>
          <Button
            variant="warning"
            className="w-auto"
            onClick={isEdit ? handleUpdate : handleAdd}
          >
            {isEdit ? "Güncelle" : "Ekle"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BuildingParameters;
