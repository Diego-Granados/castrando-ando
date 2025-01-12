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
import { Reply, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactRequests() {
  // Mock data for demonstration
  const [requests, setRequests] = useState([
    {
      id: 1,
      cedula: "123456789",
      name: "Juan Pérez",
      email: "juan@example.com",
      message: "Me gustaría obtener más información sobre las campañas...",
      status: "pending",
      createdAt: "2024-01-15",
      reply: null,
    },
    {
      id: 2,
      cedula: "987654321",
      name: "María López",
      email: "maria@example.com",
      message: "¿Cuándo será la próxima campaña?",
      status: "replied",
      createdAt: "2024-01-10",
      reply: "La próxima campaña será el próximo mes...",
    },
  ]);

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
    // Here will go the logic to send the reply
    toast.success("Respuesta enviada con éxito");
    handleCloseModals();
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

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Solicitudes de Contacto</h1>
          </div>

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
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.cedula}</td>
                  <td>{request.name}</td>
                  <td>{request.email}</td>
                  <td>{request.createdAt}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleView(request)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleReply(request)}
                    >
                      <Reply size={16} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(request)}
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
        <Modal.Header closeButton>
          <Modal.Title>Responder Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSendReply}>
            <div className="mb-3">
              <strong>Mensaje original:</strong>
              <p className="mt-2">{selectedRequest?.message}</p>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Su respuesta</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Escriba su respuesta..."
                defaultValue={selectedRequest?.reply}
                required
              />
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
                Enviar Respuesta
              </Button>
            </div>
          </Form>
        </Modal.Body>
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
