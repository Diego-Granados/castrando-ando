"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Carousel,
  Table,
} from "react-bootstrap";
import {
  BsCalendar,
  BsClock,
  BsGeoAlt,
  BsPeople,
  BsPencil,
  BsTrash,
} from "react-icons/bs";
import Link from "next/link";
import ActivityController from "@/controllers/ActivityController";
import useSubscription from "@/hooks/useSubscription";
import { toast } from "react-toastify";

export default function AdminActividades() {
  const [activities, setActivities] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedActivityParticipants, setSelectedActivityParticipants] =
    useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  // Subscribe to activities updates
  const { loading, error } = useSubscription(
    () => ActivityController.getAll(setActivities),
    []
  );

  const handleActivityClick = (activity, id) => {
    setSelectedActivity(activity);
    setShowModal(true);
    setIsEditing(false);
    setSelectedActivityId(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
    setIsEditing(false);
    setEditForm(null);
  };

  const handleEdit = (activity) => {
    setEditForm({ ...activity });
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    try {
      const result = await ActivityController.updateActivity(selectedActivityId, {
        title: editForm.title,
        description: editForm.description,
        date: editForm.date,
        hour: editForm.hour,
        duration: editForm.duration,
        location: editForm.location,
        capacityType: editForm.capacityType,
        totalCapacity:
          editForm.capacityType === "limitada" ? editForm.totalCapacity : null,
        available:
          editForm.capacityType === "limitada" ? editForm.available : null,
        requirements: editForm.requirements,
        imagesToDelete: editForm.imagesToDelete || [],
        newImages: editForm.newImages || [],
        images: editForm.images || [],
      });

      if (result.ok) {
        toast.success("¡Actividad actualizada exitosamente!", {
          position: "top-center",
        });
      } else {
        toast.error(result.error || "Error al actualizar la actividad");
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Error al actualizar la actividad");
    }
  };

  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await ActivityController.deleteActivity(activityToDelete, selectedActivityId);
      if (result.ok) {
        setShowDeleteModal(false);
        setShowModal(false);
        toast.success("¡Actividad eliminada exitosamente!", {
          position: "top-center",
        });
      } else {
        toast.error(result.error || "Error al eliminar la actividad");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Error al eliminar la actividad");
    }
  };

  const getStatusBadge = (activity) => {
    const activityDate = new Date(`${activity.fecha}T${activity.hora}Z`);
    const now = new Date();

    if (activityDate < now) {
      return <span className="badge bg-secondary">Terminada</span>;
    } else if (activity.available === 0) {
      return <span className="badge bg-danger text-dark">Sin cupos</span>;
    } else if (activity.capacityType === "limitada") {
      return (
        <span className="badge bg-success">
          Cupos disponibles: {activity.available}
        </span>
      );
    } else {
      return <span className="badge bg-info">Cupos ilimitados</span>;
    }
  };

  const handleViewParticipants = (activity) => {
    setSelectedActivity(activity);
    setShowParticipantsModal(true);
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando actividades...</div>;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: "#2055A5" }}>Administrar Actividades</h1>
        <Link href="/admin/actividades/crear" passHref>
          <Button variant="success">Crear Actividad</Button>
        </Link>
      </div>

      <Row>
        {Object.entries(activities).map(([id, activity]) => (
          <Col key={id} lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              {activity.images && activity.images.length > 0 && (
                <Carousel>
                  {activity.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={image}
                        alt={`Slide ${index + 1}`}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title>{activity.title}</Card.Title>
                  {getStatusBadge(activity)}
                </div>
                <Card.Text className="text-muted mb-3">
                  <BsCalendar className="me-2" />
                  {new Date(activity.date + "T08:00:00Z").toLocaleDateString()}
                  <br />
                  <BsClock className="me-2" />
                  {activity.hour}
                  <br />
                  <BsGeoAlt className="me-2" />
                  {activity.location}
                </Card.Text>
                <div className="mt-auto">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleActivityClick(activity, id)}
                    className="w-100"
                  >
                    Ver detalles
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {selectedActivity && !isEditing && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedActivity.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedActivity.images &&
                selectedActivity.images.length > 0 && (
                  <Carousel className="mb-4">
                    {selectedActivity.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={image}
                          alt={`Image ${index + 1}`}
                          style={{ height: "400px", objectFit: "cover" }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              <h5>Descripción</h5>
              <p>{selectedActivity.description}</p>

              <Row className="mb-3">
                <Col md={4}>
                  <BsCalendar className="me-2" />
                  <strong>Fecha:</strong>
                  <br />
                  {new Date(
                    selectedActivity.date + "T08:00:00Z"
                  ).toLocaleDateString()}
                </Col>
                <Col md={4}>
                  <BsClock className="me-2" />
                  <strong>Hora:</strong>
                  <br />
                  {selectedActivity.hour}
                </Col>
                <Col md={4}>
                  <BsClock className="me-2" />
                  <strong>Duración:</strong>
                  <br />
                  {selectedActivity.duration}
                </Col>
              </Row>

              <p>
                <BsGeoAlt className="me-2" />
                <strong>Ubicación:</strong>
                <br />
                {selectedActivity.location}
              </p>

              {selectedActivity.requirements && (
                <>
                  <h5>Requisitos</h5>
                  <p>{selectedActivity.requirements}</p>
                </>
              )}

              {selectedActivity.capacityType === "limitada" && (
                <p>
                  <BsPeople className="me-2" />
                  <strong>Capacidad:</strong>
                  <br />
                  {selectedActivity.available} cupos disponibles de{" "}
                  {selectedActivity.totalCapacity}
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="info"
                onClick={() => handleViewParticipants(selectedActivity)}
              >
                Ver Participantes
              </Button>
              <Button
                variant="primary"
                onClick={() => handleEdit(selectedActivity)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteClick(selectedActivity)}
              >
                Eliminar
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}

        {isEditing && editForm && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Editar Actividad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditSubmit();
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora</Form.Label>
                      <Form.Control
                        type="time"
                        value={editForm.hour}
                        onChange={(e) =>
                          setEditForm({ ...editForm, hour: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duración</Form.Label>
                      <Form.Control
                        type="text"
                        value={editForm.duration}
                        onChange={(e) =>
                          setEditForm({ ...editForm, duration: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo de capacidad</Form.Label>
                  <Form.Select
                    value={editForm.capacityType}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        capacityType: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="ilimitada">Ilimitada</option>
                    <option value="limitada">Limitada</option>
                  </Form.Select>
                </Form.Group>

                {editForm.capacityType === "limitada" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Capacidad total</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={editForm.totalCapacity}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            totalCapacity: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Cupos disponibles</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max={editForm.totalCapacity}
                        value={editForm.available}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            available: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </Form.Group>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Requisitos</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editForm.requirements}
                    onChange={(e) =>
                      setEditForm({ ...editForm, requirements: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imágenes actuales</Form.Label>
                  <div className="image-preview-container">
                    {editForm.images &&
                      editForm.images.map((url, index) => (
                        <div key={index} className="position-relative mb-2">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => {
                              setEditForm((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index
                                ),
                                imagesToDelete: [
                                  ...(prev.imagesToDelete || []),
                                  url,
                                ],
                              }));
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Agregar nuevas imágenes</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setEditForm((prev) => ({
                        ...prev,
                        newImages: [...(prev.newImages || []), ...files],
                      }));
                    }}
                    className="mb-3"
                  />
                  {editForm.newImages && editForm.newImages.length > 0 && (
                    <div>
                      <p>
                        Nuevas imágenes seleccionadas:{" "}
                        {editForm.newImages.length}
                      </p>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, newImages: [] }))
                        }
                      >
                        Limpiar selección
                      </Button>
                    </div>
                  )}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleEditSubmit}>
                Guardar cambios
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar esta actividad? Esta acción no se
          puede deshacer.
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

      <Modal
        show={showParticipantsModal}
        onHide={() => setShowParticipantsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Participantes Registrados - {selectedActivity?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {selectedActivity?.registeredUsers ? (
                Object.values(selectedActivity.registeredUsers).map(
                  (user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || "No disponible"}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay participantes registrados
                  </td>
                </tr>
              )}
            </tbody>
            {selectedActivity?.registeredUsers && (
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end">
                    <strong>Total de participantes:</strong>{" "}
                    {Object.keys(selectedActivity.registeredUsers).length}
                  </td>
                </tr>
              </tfoot>
            )}
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowParticipantsModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </Container>
  );
}
