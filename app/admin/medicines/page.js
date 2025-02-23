"use client";
import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import MedicineController from "@/controllers/MedicineController";
import useSubscription from "@/hooks/useSubscription";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    amount: "",
    unit: "",
    weightMultiplier: "",
    daysOfTreatment: "",
  });

  // Error Modal State
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  // Use the subscription hook to load medicines
  const { loading, error } = useSubscription(() =>
    MedicineController.getAllMedicines(setMedicines)
  );

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    
    if (!newMedicine.name || !newMedicine.amount || !newMedicine.weightMultiplier || !newMedicine.daysOfTreatment) {
      setErrorMessage("Por favor complete todos los campos");
      setShowErrorModal(true);
      return;
    }

    try {
      if (editingMedicine) {
        await MedicineController.updateMedicine(editingMedicine.id, newMedicine);
        setEditingMedicine(null);
      } else {
        await MedicineController.createMedicine(newMedicine);
      }

      // Reset form
      setNewMedicine({
        name: "",
        amount: "",
        unit: "",
        weightMultiplier: "",
        daysOfTreatment: "",
      });
    } catch (error) {
      setErrorMessage(
        error.message === "Ya existe un medicamento con este nombre" || 
        error.message === "Ya existe otro medicamento con este nombre"
          ? error.message
          : "Error al guardar el medicamento"
      );
      setShowErrorModal(true);
      console.error(error);
    }
  };

  const handleDeleteClick = (medicineId) => {
    setMedicineToDelete(medicineId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await MedicineController.deleteMedicine(medicineToDelete);
      if (editingMedicine?.id === medicineToDelete) {
        handleCancelEdit();
      }
      setShowDeleteModal(false);
    } catch (error) {
      setErrorMessage("Error al eliminar el medicamento");
      setShowErrorModal(true);
      console.error(error);
    }
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setNewMedicine({
      name: medicine.name,
      amount: medicine.amount,
      unit: medicine.unit,
      weightMultiplier: medicine.weightMultiplier,
      daysOfTreatment: medicine.daysOfTreatment,
    });
  };

  const handleCancelEdit = () => {
    setEditingMedicine(null);
    setNewMedicine({
      name: "",
      amount: "",
      unit: "",
      weightMultiplier: "",
      daysOfTreatment: "",
    });
  };

  const formatMedicineDescription = (medicine) => {
    return `${medicine.amount} ${medicine.unit} por cada ${medicine.weightMultiplier} kilogramos de peso por ${medicine.daysOfTreatment} días`;
  };

  return (
    <main className="container py-4">
      <h1 className="mb-4">Configuración de Medicamentos</h1>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            {editingMedicine ? 'Editar Medicamento' : 'Agregar Nuevo Medicamento'}
          </Card.Title>
          <Form onSubmit={handleAddMedicine}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>Nombre del medicamento</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, name: e.target.value })
                    }
                    placeholder="Ej: Meloxicam"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    value={newMedicine.amount}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, amount: e.target.value })
                    }
                    placeholder="Ej: 100"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Unidad</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMedicine.unit}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, unit: e.target.value })
                    }
                    placeholder="Ej: mg, pastillas, ml"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Por cada (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newMedicine.weightMultiplier}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        weightMultiplier: e.target.value,
                      })
                    }
                    placeholder="Ej: 10"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Días de tratamiento</Form.Label>
                  <Form.Control
                    type="number"
                    value={newMedicine.daysOfTreatment}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        daysOfTreatment: e.target.value,
                      })
                    }
                    placeholder="Ej: 5"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="flex-grow-1"
              >
                {editingMedicine ? 'Actualizar Medicamento' : 'Agregar Medicamento'}
              </Button>
              
              {editingMedicine && (
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <h2 className="mb-3">Medicamentos Configurados</h2>
      
      {medicines.length === 0 ? (
        <Card>
          <Card.Body>
            <p className="text-center mb-0">No hay medicamentos configurados</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {medicines.map((medicine) => (
            <Col key={medicine.id} md={6} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{medicine.name}</Card.Title>
                  <Card.Text>{formatMedicineDescription(medicine)}</Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => handleEditMedicine(medicine)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(medicine.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar este medicamento?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
} 