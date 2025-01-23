"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Carousel, Form, Badge } from "react-bootstrap";
import Link from "next/link";
import SupportRequestController from "@/controllers/SupportRequestController";
import { BsGeoAlt, BsCalendar, BsTelephone, BsPerson } from "react-icons/bs";
import { toast } from "react-toastify";

export default function SolicitarApoyo() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const statusOptions = [
    "Pendiente",
    "En proceso",
    "Completado",
    "Cancelado"
  ];

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const result = await SupportRequestController.getRequests();
        if (result.ok) {
          setRequests(result.requests);
        } else {
          toast.error("Error al cargar las solicitudes");
        }
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        toast.error("Error al cargar las solicitudes");
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!requestToDelete || !requestToDelete.id) {
      toast.error("Error: No se pudo identificar la solicitud");
      return;
    }

    try {
      const result = await SupportRequestController.deleteRequest(requestToDelete.id);
      
      if (result.ok) {
        toast.success("Solicitud eliminada exitosamente");
        // Actualizar la lista de solicitudes
        const updatedResult = await SupportRequestController.getRequests();
        if (updatedResult.ok) {
          setRequests(updatedResult.requests);
        }
      } else {
        toast.error(result.error || "Error al eliminar la solicitud");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar la solicitud");
    } finally {
      setShowDeleteModal(false);
      setRequestToDelete(null);
      setShowModal(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const result = await SupportRequestController.updateRequestStatus(selectedRequest.id, newStatus);
      if (result.ok) {
        toast.success("Estado actualizado exitosamente");
        const updatedResult = await SupportRequestController.getRequests();
        if (updatedResult.ok) {
          setRequests(updatedResult.requests);
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      } else {
        toast.error(result.error || "Error al actualizar el estado");
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      "Pendiente": "warning",
      "En proceso": "info",
      "Completado": "success",
      "Cancelado": "danger"
    };
    return (
      <Badge bg={statusStyles[status] || "secondary"} className="mb-2">
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <h2>Cargando solicitudes...</h2>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Solicitudes de Apoyo
      </h1>

      <div className="d-flex justify-content-end align-items-center mb-4">
        <Link href="/admin/solicitarApoyo/crear" passHref>
          <Button 
            variant="success" 
            className="rounded-pill"
            style={{ padding: "10px 20px" }}
          >
            Solicitar Apoyo
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="text-center">
          <h2>No hay solicitudes de apoyo</h2>
        </div>
      ) : (
        <Row className="g-4">
          {requests.map((request) => (
            <Col key={request.id} xs={12} md={6} lg={4}>
              <div 
                className="card h-100 shadow-sm hover-shadow" 
                style={{ cursor: "pointer" }}
                onClick={() => handleRequestClick(request)}
              >
                <div className="position-relative">
                  {request.imageUrl && (
                    <img
                      src={request.imageUrl}
                      alt="Imagen de solicitud"
                      className="card-img-top"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  )}
                  <div className="position-absolute top-0 end-0 m-2">
                    {getStatusBadge(request.status)}
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title text-center mb-2">{request.title}</h5>
                  <p className="card-text">
                    {request.description.substring(0, 100)}
                    {request.description.length > 100 ? "..." : ""}
                  </p>
                  <div className="d-flex align-items-center mb-2">
                    <BsPerson className="me-2" />
                    <small className="text-muted">{request.userName}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <BsCalendar className="me-2" />
                    <small className="text-muted">{request.date}</small>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        {selectedRequest && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedRequest.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedRequest.imageUrl && (
                <img
                  src={selectedRequest.imageUrl}
                  alt="Imagen de solicitud"
                  className="w-100 mb-3"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              )}
              <div className="mb-3">
                <h5>Estado</h5>
                <div className="d-flex align-items-center gap-2">
                  {getStatusBadge(selectedRequest.status)}
                    <Form.Select
                      size="sm"
                      value={selectedRequest.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      style={{ width: 'auto' }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                </div>
              </div>
              <div className="mb-3">
                <h5>Descripción</h5>
                <p>{selectedRequest.description}</p>
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsPerson className="me-2" />
                  <h5 className="mb-0">Publicado por</h5>
                </div>
                <p>{selectedRequest.userName}</p>
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsCalendar className="me-2" />
                  <h5 className="mb-0">Fecha de Publicación</h5>
                </div>
                <p>{selectedRequest.date}</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleDeleteClick(selectedRequest)}>
                  Eliminar
                </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar esta solicitud? Esta acción no se puede deshacer.
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

      <style jsx global>{`
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
          transition: all .3s ease-in-out;
        }
      `}</style>
    </Container>
  );
}
