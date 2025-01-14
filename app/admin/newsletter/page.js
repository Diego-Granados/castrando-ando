"use client";
import { useState, useEffect } from "react";
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
import NewsletterController from "@/controllers/NewsletterController";

export default function NewsletterMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Use AbortController for cleanup
  useEffect(() => {
    const abortController = new AbortController();

    const fetchMessages = async () => {
      try {
        const newsletterMessages = await NewsletterController.getAllMessages();
        if (!abortController.signal.aborted) {
          setMessages(newsletterMessages);
          setLoading(false);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error loading messages:", error);
          toast.error("Error al cargar los mensajes");
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      abortController.abort();
    };
  }, []);

  const loadMessages = async () => {
    try {
      const newsletterMessages = await NewsletterController.getAllMessages();
      setMessages(newsletterMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Error al cargar los mensajes");
    }
  };

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
    const formData = new FormData(event.target);
    
    try {
      if (!formData.get("subject")?.trim() || !formData.get("content")?.trim()) {
        toast.error("Por favor complete todos los campos");
        return;
      }

      const messageData = {
        subject: formData.get("subject").trim(),
        content: formData.get("content").trim()
      };

      if (isEditing && selectedMessage) {
        await NewsletterController.updateMessage(selectedMessage.id, {
          ...selectedMessage,
          ...messageData
        });
        toast.success("Mensaje actualizado");
      } else {
        await NewsletterController.createMessage(messageData);
        toast.success("Mensaje guardado");
      }
      
      await loadMessages();
      handleCloseModals();
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("Error al guardar el mensaje");
    }
  };

  const handleConfirmSend = async () => {
    try {
      await NewsletterController.sendMessage(selectedMessage);
      toast.success("Mensaje enviado a todos los suscriptores");
      loadMessages();
      handleCloseModals();
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Error al enviar el boletín");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await NewsletterController.deleteMessage(selectedMessage.id);
      toast.success("Mensaje eliminado");
      loadMessages();
      handleCloseModals();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error al eliminar el mensaje");
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <Card className="shadow">
          <Card.Body>
            <p>Cargando mensajes...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

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
                name="subject"
                placeholder="Ingrese el asunto del mensaje"
                defaultValue={selectedMessage?.subject}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
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
