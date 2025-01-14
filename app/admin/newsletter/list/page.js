"use client";
import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import NewsletterController from "@/controllers/NewsletterController";

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const subscribersList = await NewsletterController.getAllSubscribers();
      setSubscribers(subscribersList);
    } catch (error) {
      console.error("Error loading subscribers:", error);
      toast.error("Error al cargar los suscriptores");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedSubscriber(null);
    setNewEmail("");
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    try {
      await NewsletterController.addSubscriber({
        email: newEmail.trim(),
        subscribedAt: new Date().toISOString()
      });
      
      toast.success("Suscriptor agregado correctamente");
      await loadSubscribers();
      handleCloseModals();
    } catch (error) {
      console.error("Error adding subscriber:", error);
      toast.error("Error al agregar el suscriptor");
    }
  };

  const handleUpdateSubscriber = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      
      await NewsletterController.updateSubscriber(selectedSubscriber.id, {
        ...selectedSubscriber,
        email: formData.get("email").trim()
      });
      
      toast.success("Suscriptor actualizado correctamente");
      await loadSubscribers();
      handleCloseModals();
    } catch (error) {
      console.error("Error updating subscriber:", error);
      toast.error("Error al actualizar el suscriptor");
    }
  };

  const handleDeleteSubscriber = async () => {
    try {
      await NewsletterController.deleteSubscriber(selectedSubscriber.id);
      toast.success("Suscriptor eliminado correctamente");
      await loadSubscribers();
      handleCloseModals();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Error al eliminar el suscriptor");
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <p>Cargando suscriptores...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Suscriptores</h1>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} className="me-2" />
          Agregar Suscriptor
        </Button>
      </div>

      {subscribers.length === 0 ? (
        <p>No hay suscriptores registrados</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Email</th>
              <th>Fecha de suscripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td>{subscriber.email}</td>
                <td>{new Date(subscriber.subscribedAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSelectedSubscriber(subscriber);
                      setShowEditModal(true);
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setSelectedSubscriber(subscriber);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Subscriber Modal */}
      <Modal show={showAddModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Suscriptor</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubscriber}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Ingrese el correo electrónico"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModals}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Agregar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Subscriber Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Suscriptor</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubscriber}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={selectedSubscriber?.email}
                placeholder="Ingrese el correo electrónico"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModals}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Suscriptor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro que desea eliminar al suscriptor{" "}
            {selectedSubscriber?.email}?
          </p>
          <p className="text-danger">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteSubscriber}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
