"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Carousel } from "react-bootstrap";
import { BsCalendar, BsClock, BsGeoAlt, BsPeople } from "react-icons/bs";

export default function Actividades() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const handleRegistration = (activity) => {
    const activityDate = new Date(`${activity.fecha}T${activity.hora}`);
    const now = new Date();

    // Check if activity has ended
    if (activityDate < now || activity.estado === "finalizada") {
      alert("No es posible registrarse a una actividad que ya finalizó");
      return;
    }

    // Check if activity has available spots
    if (activity.tipoCapacidad === "limitada") {
      if (activity.cuposDisponibles <= 0) {
        alert("Lo sentimos, no hay cupos disponibles para esta actividad");
        return;
      }

      // Update available spots
      const updatedActivities = activities.map(act => {
        if (act.id === activity.id) {
          return {
            ...act,
            cuposDisponibles: act.cuposDisponibles - 1,
            estado: act.cuposDisponibles - 1 === 0 ? "sin_cupos" : act.estado
          };
        }
        return act;
      });
      setActivities(updatedActivities);
    }
    
    alert("Te has registrado exitosamente para esta actividad");
    handleCloseModal();
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
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>Actividades Comunitarias</h1>
      
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
                <div className="mt-auto">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleActivityClick(activity)}
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
        {selectedActivity && (
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
              <Button
                variant="primary"
                onClick={() => handleRegistration(selectedActivity)}
                disabled={
                  selectedActivity.estado === "finalizada" ||
                  new Date(`${selectedActivity.fecha}T${selectedActivity.hora}`) < new Date() ||
                  (selectedActivity.tipoCapacidad === "limitada" && selectedActivity.cuposDisponibles === 0)
                }
              >
                {selectedActivity.tipoCapacidad === "limitada" && selectedActivity.cuposDisponibles === 0
                  ? "Sin cupos disponibles"
                  : selectedActivity.estado === "finalizada" || new Date(`${selectedActivity.fecha}T${selectedActivity.hora}`) < new Date()
                  ? "Actividad finalizada"
                  : "Registrarme"}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
} 