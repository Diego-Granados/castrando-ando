"use client";
import { useState } from "react";
import {
  Container,
  Card,
  Button,
  Modal,
  Form,
  Table,
  Badge,
} from "react-bootstrap";
import { Plus, Pencil, Trash2, Send } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
export default function NewsletterMessages() {
  // Mock data for demonstration
  const [messages, setMessages] = useState([
    {
      id: 1,
      subject: "Nueva campaña de castración",
      content: "Detalles sobre la próxima campaña...",
      status: "draft",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      subject: "Resultados de la campaña",
      content: "Gracias a todos los participantes...",
      status: "sent",
      createdAt: "2024-01-10",
      sentAt: "2024-01-11",
    },
  ]);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCloseModals = () => {
    setShowMessageModal(false);
    setShowDeleteModal(false);
    setShowSendModal(false);
    setSelectedMessage(null);
    setIsEditing(false);
  };

  const handleEdit = (message) => {
    setSelectedMessage(message);
    setIsEditing(true);
    setShowMessageModal(true);
  };

  const handleDelete = (message) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
  };

  const handleSend = (message) => {
    setSelectedMessage(message);
    setShowSendModal(true);
  };

  const handleSaveMessage = async (event) => {
    event.preventDefault();
    // Here will go the logic to save the message
    toast.success(isEditing ? "Mensaje actualizado" : "Mensaje guardado");
    handleCloseModals();
  };

  const handleConfirmSend = async () => {
    // Here will go the logic to send the newsletter
    toast.success("Mensaje enviado a todos los suscriptores");
    handleCloseModals();
  };

  const handleConfirmDelete = async () => {
    // Here will go the logic to delete the message
    toast.success("Mensaje eliminado");
    handleCloseModals();
  };

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Mensajes del Boletín</h1>
            <div className="d-flex gap-5">
              <Link href="/admin/newsletter/list">
                <Button variant="outline-primary">Lista de suscriptores</Button>
              </Link>
              <Button
                variant="primary"
                onClick={() => setShowMessageModal(true)}
              >
                <Plus size={20} className="me-2" />
                Nuevo Mensaje
              </Button>
            </div>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Asunto</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th>Fecha de envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.subject}</td>
                  <td>
                    <Badge
                      bg={message.status === "sent" ? "success" : "warning"}
                    >
                      {message.status === "sent" ? "Enviado" : "Borrador"}
                    </Badge>
                  </td>
                  <td>{message.createdAt}</td>
                  <td>{message.sentAt || "-"}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(message)}
                    >
                      <Pencil size={16} />
                    </Button>
                    {message.status !== "sent" && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleSend(message)}
                      >
                        <Send size={16} />
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(message)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Message Modal */}
      <Modal show={showMessageModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Mensaje" : "Nuevo Mensaje"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveMessage}>
            <Form.Group className="mb-3">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el asunto del mensaje"
                defaultValue={selectedMessage?.subject}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                placeholder="Escriba el contenido del mensaje..."
                defaultValue={selectedMessage?.content}
                required
              />
              <Form.Text className="text-muted">
                Puede usar texto enriquecido y HTML básico para dar formato al
                mensaje.
              </Form.Text>
            </Form.Group>
            <div className="text-end">
              <Button
                variant="secondary"
                onClick={handleCloseModals}
                className="me-2"
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Send Confirmation Modal */}
      <Modal show={showSendModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Enviar Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro que desea enviar este mensaje a todos los suscriptores?
          </p>
          <p>
            <strong>Asunto:</strong> {selectedMessage?.subject}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleConfirmSend}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar este mensaje?</p>
          <p>
            <strong>Asunto:</strong> {selectedMessage?.subject}
          </p>
          <p className="text-danger">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
