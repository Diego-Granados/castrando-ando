"use client";
import { useState } from "react";
import { Container, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function NewsletterAdmin() {
  // Mock data for demonstration
  const [subscribers, setSubscribers] = useState([
    {
      id: 1,
      email: "ejemplo@mail.com",
      subscribed: true,
    },
    {
      id: 2,
      email: "test@mail.com",
      subscribed: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedSubscriber(null);
  };

  const handleEdit = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowEditModal(true);
  };

  const handleDelete = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowDeleteModal(true);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Suscriptores</h1>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} className="me-2" />
          Agregar Suscriptor
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id}>
              <td>{subscriber.email}</td>
              <td>
                <Badge bg={subscriber.subscribed ? "success" : "danger"}>
                  {subscriber.subscribed ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(subscriber)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(subscriber)}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Subscriber Modal */}
      <Modal show={showAddModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Suscriptor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese el correo electrónico"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancelar
          </Button>
          <Button variant="primary">Agregar</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Subscriber Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Suscriptor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese el correo electrónico"
                defaultValue={selectedSubscriber?.email}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="subscription-status"
                label="Suscripción activa"
                defaultChecked={selectedSubscriber?.subscribed}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancelar
          </Button>
          <Button variant="primary">Guardar cambios</Button>
        </Modal.Footer>
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
          <Button variant="danger">Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
