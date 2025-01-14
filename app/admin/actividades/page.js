"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Carousel } from "react-bootstrap";
import { BsCalendar, BsClock, BsGeoAlt, BsPeople, BsPencil, BsTrash } from "react-icons/bs";
import Link from "next/link";

export default function AdminActividades() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const sampleActivities = [
          {
            id: 1,
            titulo: "Campaña de Esterilización",
            descripcion: "Únete a nuestra campaña mensual de esterilización. Ayúdanos a controlar la población de mascotas de manera responsable.",
            fecha: "2024-03-15",
            hora: "09:00",
            duracion: "6 horas",
            ubicacion: "Clínica Veterinaria Central",
            tipoCapacidad: "limitada",
            capacidadTotal: 20,
            cuposDisponibles: 8,
            requisitos: "Traer mascota en ayuno de 8 horas. Mayores de 6 meses.",
            estado: "activa",
            imagenes: [
              "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800",
              "https://images.unsplash.com/photo-1612531823729-f07c38f338c8?w=800"
            ]
          },
          {
            id: 2,
            titulo: "Feria de Adopción",
            descripcion: "Gran feria de adopción con diferentes especies de mascotas. Ven y encuentra a tu compañero ideal.",
            fecha: "2024-03-20",
            hora: "10:00",
            duracion: "5 horas",
            ubicacion: "Parque Central",
            tipoCapacidad: "ilimitada",
            requisitos: "Traer identificación vigente.",
            estado: "activa",
            imagenes: [
              "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800",
              "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800"
            ]
          },
          {
            id: 3,
            titulo: "Taller de Primeros Auxilios",
            descripcion: "Aprende técnicas básicas de primeros auxilios para mascotas en situaciones de emergencia.",
            fecha: "2024-03-25",
            hora: "14:00",
            duracion: "3 horas",
            ubicacion: "Centro Comunitario",
            tipoCapacidad: "limitada",
            capacidadTotal: 15,
            cuposDisponibles: 0,
            requisitos: "Traer libreta para apuntes.",
            estado: "sin_cupos",
            imagenes: [
              "https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=800"
            ]
          }
        ];
        setActivities(sampleActivities);
      } catch (error) {
        console.error("Error cargando actividades:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
    setIsEditing(false);
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

  const handleEditSubmit = () => {
    const updatedActivities = activities.map(activity =>
      activity.id === editForm.id ? editForm : activity
    );
    setActivities(updatedActivities);
    setIsEditing(false);
    setEditForm(null);
    handleCloseModal();
    alert("Actividad actualizada exitosamente");
  };

  const handleDelete = (activityId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta actividad?")) {
      setActivities(activities.filter(activity => activity.id !== activityId));
      handleCloseModal();
      alert("Actividad eliminada exitosamente");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setEditForm(prev => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), ...imageUrls]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setEditForm(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, index) => index !== indexToRemove)
    }));
  };

  const getStatusBadge = (activity) => {
    const activityDate = new Date(`${activity.fecha}T${activity.hora}`);
    const now = new Date();

    if (activity.estado === "finalizada" || activityDate < now) {
      return <span className="badge bg-secondary">Terminada</span>;
    } else if (activity.estado === "sin_cupos") {
      return <span className="badge bg-warning text-dark">Sin cupos</span>;
    } else if (activity.tipoCapacidad === "limitada") {
      return <span className="badge bg-success">Cupos disponibles: {activity.cuposDisponibles}</span>;
    } else {
      return <span className="badge bg-info">Cupos ilimitados</span>;
    }
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
        {activities.map((activity) => (
          <Col key={activity.id} lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              {activity.imagenes && activity.imagenes.length > 0 && (
                <Card.Img
                  variant="top"
                  src={activity.imagenes[0]}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title>{activity.titulo}</Card.Title>
                  {getStatusBadge(activity)}
                </div>
                <Card.Text className="text-muted mb-3">
                  <BsCalendar className="me-2" />
                  {new Date(activity.fecha).toLocaleDateString()}
                  <br />
                  <BsClock className="me-2" />
                  {activity.hora}
                  <br />
                  <BsGeoAlt className="me-2" />
                  {activity.ubicacion}
                </Card.Text>
                <div className="mt-auto d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleActivityClick(activity)}
                    className="flex-grow-1"
                  >
                    Ver detalles
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(activity.id)}
                  >
                    <BsTrash />
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
              <Modal.Title>{selectedActivity.titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedActivity.imagenes && selectedActivity.imagenes.length > 0 && (
                <Carousel className="mb-4">
                  {selectedActivity.imagenes.map((imagen, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={imagen}
                        alt={`Imagen ${index + 1}`}
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
              <h5>Descripción</h5>
              <p>{selectedActivity.descripcion}</p>
              
              <Row className="mb-3">
                <Col md={4}>
                  <BsCalendar className="me-2" />
                  <strong>Fecha:</strong>
                  <br />
                  {new Date(selectedActivity.fecha).toLocaleDateString()}
                </Col>
                <Col md={4}>
                  <BsClock className="me-2" />
                  <strong>Hora:</strong>
                  <br />
                  {selectedActivity.hora}
                </Col>
                <Col md={4}>
                  <BsClock className="me-2" />
                  <strong>Duración:</strong>
                  <br />
                  {selectedActivity.duracion}
                </Col>
              </Row>

              <p>
                <BsGeoAlt className="me-2" />
                <strong>Ubicación:</strong>
                <br />
                {selectedActivity.ubicacion}
              </p>

              {selectedActivity.requisitos && (
                <>
                  <h5>Requisitos</h5>
                  <p>{selectedActivity.requisitos}</p>
                </>
              )}

              {selectedActivity.tipoCapacidad === "limitada" && (
                <p>
                  <BsPeople className="me-2" />
                  <strong>Capacidad:</strong>
                  <br />
                  {selectedActivity.cuposDisponibles} cupos disponibles de {selectedActivity.capacidadTotal}
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={() => handleEdit(selectedActivity)}>
                <BsPencil className="me-2" />
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(selectedActivity.id)}>
                <BsTrash className="me-2" />
                Eliminar
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
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.titulo}
                    onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editForm.descripcion}
                    onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="date"
                        value={editForm.fecha}
                        onChange={(e) => setEditForm({ ...editForm, fecha: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora</Form.Label>
                      <Form.Control
                        type="time"
                        value={editForm.hora}
                        onChange={(e) => setEditForm({ ...editForm, hora: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duración</Form.Label>
                      <Form.Control
                        type="text"
                        value={editForm.duracion}
                        onChange={(e) => setEditForm({ ...editForm, duracion: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.ubicacion}
                    onChange={(e) => setEditForm({ ...editForm, ubicacion: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo de capacidad</Form.Label>
                  <Form.Select
                    value={editForm.tipoCapacidad}
                    onChange={(e) => setEditForm({ ...editForm, tipoCapacidad: e.target.value })}
                    required
                  >
                    <option value="ilimitada">Ilimitada</option>
                    <option value="limitada">Limitada</option>
                  </Form.Select>
                </Form.Group>

                {editForm.tipoCapacidad === "limitada" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Capacidad total</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={editForm.capacidadTotal}
                        onChange={(e) => setEditForm({ ...editForm, capacidadTotal: e.target.value })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Cupos disponibles</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max={editForm.capacidadTotal}
                        value={editForm.cuposDisponibles}
                        onChange={(e) => setEditForm({ ...editForm, cuposDisponibles: e.target.value })}
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
                    value={editForm.requisitos}
                    onChange={(e) => setEditForm({ ...editForm, requisitos: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={editForm.estado}
                    onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                    required
                  >
                    <option value="activa">Activa</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="sin_cupos">Sin cupos</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imágenes</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mb-3"
                  />
                  <div className="image-preview-container">
                    {editForm.imagenes && editForm.imagenes.map((url, index) => (
                      <div key={index} className="position-relative mb-2">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-1"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
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
    </Container>
  );
} 