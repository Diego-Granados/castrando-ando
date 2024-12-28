"use client";
import { useState } from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PetCard from "@/components/PetCard";
import PetForm from "./PetForm";
import PetController from "@/controllers/PetController";
import { toast } from "react-toastify";
import useSubscription from "@/hooks/useSubscription";

export default function PetPanel() {
    const [pets, setPets] = useState({});
    const [showPetModal, setShowPetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petToDelete, setPetToDelete] = useState(null);

  const { loading, error } = useSubscription(() => PetController.getPets(setPets));

  const handlePetAdded = async () => {
    setShowPetModal(false);
    setSelectedPet(null);
  };

  const handleDeletePet = async () => {
    try {
      await PetController.delete(petToDelete.id, petToDelete.imageUrl);
      toast.success("Mascota eliminada con éxito", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
        console.error(error);
      toast.error("Error al eliminar la mascota", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setShowDeleteModal(false);
      setPetToDelete(null);
    }
  };

  const handleUpdatePet = (petId, pet) => {
    setSelectedPet({ id: petId, ...pet });
    setShowPetModal(true);
  };

  return (
    <Card className="shadow">
      <Card.Body>
        <h3 className="mb-4">Mis Mascotas</h3>
        <Row xs={1} md={2} lg={3} className="g-4">
          {Object.entries(pets).map(([id, pet]) => (
            <Col key={id}>
              <Card>
                <PetCard pet={{ id, ...pet }} />
                <Card.Footer className="d-flex justify-content-between">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleUpdatePet(id, pet)}
                  >
                    <Pencil size={16} className="me-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setPetToDelete({ id, ...pet });
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 size={16} className="me-1" />
                    Eliminar
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
          <Col>
            <Card 
              className="h-100 cursor-pointer" 
              onClick={() => {
                setSelectedPet(null);
                setShowPetModal(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Plus size={48} className="text-primary" />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>

      {/* Pet Form Modal */}
      <Modal 
        show={showPetModal} 
        onHide={() => {
          setShowPetModal(false);
          setSelectedPet(null);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPet ? "Editar Mascota" : "Agregar Mascota"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PetForm 
            petId={selectedPet?.id}
            initialData={selectedPet}
            onSuccess={handlePetAdded}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setPetToDelete(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar a {petToDelete?.name}? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setShowDeleteModal(false);
              setPetToDelete(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeletePet}
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
