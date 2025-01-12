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
import { Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";

export default function UserContactRequests() {
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
      cedula: "123456789",
      name: "Juan Pérez",
      email: "juan@example.com",
      message: "¿Cuándo será la próxima campaña?",
      status: "replied",
      createdAt: "2024-01-10",
      reply: "La próxima campaña será el próximo mes...",
    },
  ]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedRequest(null);
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setShowEditModal(true);
  };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const handleUpdateRequest = async (event) => {
    event.preventDefault();
    // Here will go the logic to update the request
    toast.success("Solicitud actualizada con éxito");
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
            <h1>Mis Solicitudes de Contacto</h1>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Mensaje</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.createdAt}</td>
                  <td>{request.message.substring(0, 50)}...</td>
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
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(request)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(request)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
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
            <strong>Fecha:</strong> {selectedRequest?.createdAt}
          </div>
          <div className="mb-3">
            <strong>Estado:</strong>{" "}
            {selectedRequest && getStatusBadge(selectedRequest.status)}
          </div>
          <div className="mb-3">
            <strong>Su mensaje:</strong>
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

      {/* Edit Request Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateRequest}>
            <Form.Group className="mb-3">
              <Form.Label>Su mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Escriba su mensaje..."
                defaultValue={selectedRequest?.message}
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
                Actualizar
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
