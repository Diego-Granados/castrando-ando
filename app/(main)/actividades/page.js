"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Carousel,
} from "react-bootstrap";
import { BsCalendar, BsClock, BsGeoAlt, BsPeople } from "react-icons/bs";
import AuthController from "@/controllers/AuthController";
import ActivityController from "@/controllers/ActivityController";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { toast } from "react-toastify";
import Comments from "@/components/Comments";

export default function Actividades() {
  const [activities, setActivities] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // Subscribe to activities updates
  const { loading, error } = useSubscription(
    () => ActivityController.getAll(setActivities),
    []
  );

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await AuthController.getCurrentUser();
        if (user) {
          const userData = await AuthController.getUserData(user.uid);
          setCurrentUser(userData);
        }
      } catch (error) {
        setCurrentUser(null);
      }
    };
    checkAuth();
  }, []);

  const checkUserRegistration = useCallback(
    async (activity) => {
      if (!currentUser) return false;

      // Check if the activity has registered users and if the current user is among them
      if (
        activity.registeredUsers &&
        activity.registeredUsers[currentUser.id]
      ) {
        return true;
      }
      return false;
    },
    [currentUser]
  );

  const handleActivityClick = async (activity) => {
    setSelectedActivity(activity);
    if (currentUser) {
      const registered = await checkUserRegistration(activity);
      setIsRegistered(registered);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const handleRegistration = async (activity) => {
    try {
      if (!currentUser) {
        toast.info("Debes iniciar sesión para registrarte en una actividad");
        router.push("/userLogin");
        return;
      }

      const user = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        phone: currentUser.phone,
      };

      const result = await ActivityController.registerUser(
        activity,
        user,
        activity.capacityType === "limitada"
      );

      if (result.ok) {
        setIsRegistered(true);
        activity.available -= 1;
        toast.success("¡Te has registrado exitosamente para esta actividad!");
      } else {
        toast.error(
          result.error || "Error al registrar. Por favor intenta nuevamente."
        );
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al registrar. Por favor intenta nuevamente.");
    }
  };

  const handleDeregistration = async (activity) => {
    try {
      if (!currentUser) return;

      const user = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
      };

      const result = await ActivityController.deregisterUser(
        activity,
        user,
        activity.capacityType === "limitada"
      );

      if (result.ok) {
        activity.available += 1;
        setIsRegistered(false);
        toast.success("Has cancelado tu registro exitosamente");
      } else {
        toast.error(result.error || "Error al cancelar el registro");
      }
    } catch (error) {
      console.error("Error al cancelar registro:", error);
      toast.error("Error al cancelar el registro");
    }
  };

  const getStatusBadge = (activity) => {
    const activityDate = new Date(`${activity.date}T${activity.hour}`);
    const now = new Date();

    if (activityDate < now) {
      return <span className="badge bg-secondary">Terminada</span>;
    } else if (
      activity.capacityType === "limitada" &&
      activity.available === 0
    ) {
      return <span className="badge bg-warning text-dark">Sin cupos</span>;
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

  if (loading) {
    return <div className="text-center mt-5">Cargando actividades...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        Error al cargar las actividades
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Container className="py-4">
        <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
          Actividades Comunitarias
        </h1>

        <Row>
          {Object.entries(activities).map(([id, activity]) => (
            <Col key={id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                {activity.images && activity.images.length > 0 && (
                  <Card.Img
                    variant="top"
                    src={activity.images[0]}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{activity.title}</Card.Title>
                    {getStatusBadge(activity)}
                  </div>
                  <Card.Text className="text-muted mb-3">
                    <BsCalendar className="me-2" />
                    {new Date(
                      activity.date + "T08:00:00Z"
                    ).toLocaleDateString()}
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
                      onClick={() => handleActivityClick({ ...activity, id })}
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

        {/* Activity Details Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          {selectedActivity && (
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
                            alt={`Imagen ${index + 1}`}
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
                      selectedActivity.date + "T00:00:00Z"
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

                <div className="mt-4">
                  {!currentUser ? (
                    <Button
                      variant="primary"
                      onClick={() => router.push("/userLogin")}
                    >
                      Inicia sesión para registrarte
                    </Button>
                  ) : isRegistered ? (
                    <Button
                      variant="danger"
                      onClick={() => handleDeregistration(selectedActivity)}
                      disabled={
                        new Date(
                          `${selectedActivity.date}T${selectedActivity.hour}`
                        ) < new Date()
                      }
                    >
                      Cancelar mi registro
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleRegistration(selectedActivity)}
                      disabled={
                        new Date(
                          `${selectedActivity.date}T${selectedActivity.hour}`
                        ) < new Date() ||
                        (selectedActivity.capacityType === "limitada" &&
                          selectedActivity.available === 0)
                      }
                    >
                      {new Date(
                        `${selectedActivity.date}T${selectedActivity.hour}`
                      ) < new Date()
                        ? "Actividad finalizada"
                        : selectedActivity.capacityType === "limitada" &&
                          selectedActivity.available === 0
                        ? "Sin cupos disponibles"
                        : "Registrarme en esta actividad"}
                    </Button>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </div>
              )}

              {/* Componente de comentarios */}
              <Comments 
                entityType="activity" 
                entityId={selectedActivity.id} 
                isAdmin={isAdmin}
              />
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
