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
import { Reply, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import ContactController from "@/controllers/ContactController";

export default function ContactRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactRequests();
  }, []);

  const loadContactRequests = async () => {
    try {
      const contactRequests = await ContactController.getAllContactRequests();
      setRequests(contactRequests);
    } catch (error) {
      console.error("Error loading contact requests:", error);
      toast.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowReplyModal(false);
    setShowDeleteModal(false);
    setSelectedRequest(null);
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleReply = (request) => {
    setSelectedRequest(request);
    setShowReplyModal(true);
  };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const handleSendReply = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const reply = formData.get("reply");

    try {
      if (!reply?.trim()) {
        toast.error("La respuesta no puede estar vacía");
        return;
      }

      const success = await ContactController.replyToContactRequest(
        selectedRequest.id,
        selectedRequest,
        reply
      );

      if (success) {
        toast.success("Respuesta enviada con éxito");
        loadContactRequests();
        handleCloseModals();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Error al enviar la respuesta");
    }
  };

  const handleConfirmDelete = async () => {
    // Here will go the logic to delete the request
    toast.success("Solicitud eliminada");
    handleCloseModals();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pendiente</Badge>;
      case "replied":
        return <Badge bg="success">Respondido</Badge>;
      default:
        return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  // Separate requests into pending and responded
  const pendingRequests = requests.filter(request => !request.read);
  const respondedRequests = requests.filter(request => request.read);

  return (
    <Container className="py-4">
      {/* Pending Requests Section */}
      <Card className="shadow mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Solicitudes Pendientes</h2>
          </div>

          {loading ? (
            <p>Cargando solicitudes...</p>
          ) : pendingRequests.length === 0 ? (
            <p className="text-muted">No hay solicitudes pendientes</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <RequestRow 
                    key={request.id} 
                    request={request}
                    onView={handleView}
                    onReply={handleReply}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Responded Requests Section */}
      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Solicitudes Respondidas</h2>
          </div>

          {loading ? (
            <p>Cargando solicitudes...</p>
          ) : respondedRequests.length === 0 ? (
            <p className="text-muted">No hay solicitudes respondidas</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {respondedRequests.map((request) => (
                  <RequestRow 
                    key={request.id} 
                    request={request}
                    onView={handleView}
                    onReply={handleReply}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* View Request Modal */}
      <Modal show={showViewModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Cédula:</strong> {selectedRequest?.cedula}
          </div>
          <div className="mb-3">
            <strong>Nombre:</strong> {selectedRequest?.name}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {selectedRequest?.email}
          </div>
          <div className="mb-3">
            <strong>Fecha:</strong> {selectedRequest?.createdAt}
          </div>
          <div className="mb-3">
            <strong>Mensaje:</strong>
            <p className="mt-2">{selectedRequest?.message}</p>
          </div>
          {selectedRequest?.reply && (
            <div className="mb-3">
              <strong>Respuesta:</strong>
              <p className="mt-2">{selectedRequest.reply}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reply Modal */}
      <Modal show={showReplyModal} onHide={handleCloseModals}>
        <Form onSubmit={handleSendReply}>
          <Modal.Header closeButton>
            <Modal.Title>Responder Solicitud</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <strong>Mensaje original:</strong>
              <p className="mt-2">{selectedRequest?.message}</p>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Tu respuesta:</Form.Label>
              <Form.Control
                as="textarea"
                name="reply"
                rows={4}
                required
                placeholder="Escribe tu respuesta aquí..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModals}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Enviar Respuesta
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar esta solicitud de contacto?</p>
          <p>
            <strong>Solicitante:</strong> {selectedRequest?.name}
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

// Separate component for table rows to reduce duplication
function RequestRow({ request, onView, onReply, onDelete }) {
  return (
    <tr>
      <td>{request.idNumber}</td>
      <td>{request.name}</td>
      <td>{request.email}</td>
      <td>{new Date(request.date).toLocaleDateString()}</td>
      <td>
        <Badge bg={request.read ? "success" : "warning"}>
          {request.read ? "Respondido" : "Pendiente"}
        </Badge>
      </td>
      <td>
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={() => onView(request)}
        >
          <Eye size={16} />
        </Button>
        <Button
          variant="outline-success"
          size="sm"
          className="me-2"
          onClick={() => onReply(request)}
        >
          <Reply size={16} />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(request)}
        >
          <Trash2 size={16} />
        </Button>
      </td>
    </tr>
  );
}
