"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Carousel, Form } from "react-bootstrap";
import { BsCalendar, BsClock, BsGeoAlt, BsPeople } from "react-icons/bs";
import AuthController from "@/controllers/AuthController";
import { useRouter } from "next/navigation";
import ActivityPetSelector from './PetSelector';
import NotLoggedRegister from './NotLoggedRegister';

export default function Actividades() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    email: "",
    cedula: ""
  });
  const [alert, setAlert] = useState(null);
  const [showLoggedInPetModal, setShowLoggedInPetModal] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);
  const [userRegistration, setUserRegistration] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const sampleActivities = [
          {
            id: 1,
            titulo: "Campaña de Esterilización",
            descripcion: "Únete a nuestra campaña mensual de esterilización. Ayúdanos a controlar la población de mascotas de manera responsable.",
            fecha: "2025-03-15",
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
            fecha: "2025-03-20",
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
          },
          {
            id: 4,
            titulo: "Taller de Adiestramiento Básico",
            descripcion: "Aprende técnicas básicas de adiestramiento canino. Ideal para dueños primerizos y cachorros.",
            fecha: "2024-04-10",
            hora: "15:00",
            duracion: "2 horas",
            ubicacion: "Parque Canino Municipal",
            tipoCapacidad: "limitada",
            capacidadTotal: 12,
            cuposDisponibles: 12,
            requisitos: "Traer correa, premios y agua para tu mascota. Se recomienda traer sillas plegables.",
            estado: "activa",
            imagenes: [
              "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
              "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800"
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

  useEffect(() => {
    // Simulate getting current user's pets
    const dummyUserPets = {
      "1": {
        nombre: "Rocky",
        especie: "Perro",
        raza: "Golden Retriever",
        edad: 3,
        peso: "25",
        sexo: "Macho",
        esterilizado: true,
        imagen: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500"
      },
      "2": {
        nombre: "Luna",
        especie: "Gato",
        raza: "Siamés",
        edad: 2,
        peso: "4",
        sexo: "Hembra",
        esterilizado: true,
        imagen: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500"
      },
      "3": {
        nombre: "Max",
        especie: "Perro",
        raza: "Bulldog",
        edad: 5,
        peso: "20",
        sexo: "Macho",
        esterilizado: false,
        imagen: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=500"
      }
    };

    setCurrentUser({
      id: "123",
      email: "usuario@ejemplo.com",
      pets: dummyUserPets
    });
  }, []);

  const handleActivityClick = async (activity) => {
    setSelectedActivity(activity);
    await checkUserRegistration(activity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const handleRegistration = async (activity) => {
    try {
      let userData = null;

      // Check if user is authenticated
      try {
        const { user } = await AuthController.getCurrentUser();
        if (user) {
          userData = await AuthController.getUserData(user.uid);
          // Show pet selection modal for logged-in users instead of direct registration
          setSelectedActivity(activity);
          setShowLoggedInPetModal(true);
          return;
        }
      } catch (error) {
        // User is not authenticated, show NotLoggedRegister modal
        setSelectedActivity(activity);
        setShowRegistrationModal(true);
        return;
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setAlert({
        type: 'danger',
        message: 'Error al registrarse en la actividad. Por favor, intenta de nuevo.'
      });
    }
  };

  const handlePetSelect = (petId, pet) => {
    setSelectedPets(prev => {
      const isAlreadySelected = prev.some(p => p.id === petId);
      if (isAlreadySelected) {
        // Remove pet if already selected
        return prev.filter(p => p.id !== petId);
      } else {
        // Add pet if not selected
        return [...prev, { id: petId, ...pet }];
      }
    });
  };

  const handleLoggedInRegistration = async () => {
    try {
      const { user } = await AuthController.getCurrentUser();
      const userData = await AuthController.getUserData(user.uid);

      const activityDate = new Date(`${selectedActivity.fecha}T${selectedActivity.hora}`);
      const now = new Date();

      // Check if activity has ended
      if (activityDate < now) {
        setAlert({
          type: 'warning',
          message: 'No es posible registrarse a una actividad que ya finalizó'
        });
        return;
      }

      // Check if activity has available spots
      if (selectedActivity.tipoCapacidad === "limitada" && selectedPets.length > 0) {
        if (selectedActivity.cuposDisponibles < selectedPets.length) {
          setAlert({
            type: 'warning',
            message: `Lo sentimos, solo hay ${selectedActivity.cuposDisponibles} cupos disponibles`
          });
          return;
        }

        // Update available spots only if registering with pets
        const updatedActivities = activities.map(act => {
          if (act.id === selectedActivity.id) {
            return {
              ...act,
              cuposDisponibles: act.cuposDisponibles - selectedPets.length,
              estado: (act.cuposDisponibles - selectedPets.length) === 0 ? "sin_cupos" : act.estado
            };
          }
          return act;
        });
        setActivities(updatedActivities);
      }

      // Register the user with or without pets
      console.log("Registrando usuario en actividad:", {
        activityId: selectedActivity.id,
        userId: userData.id,
        userEmail: userData.email,
        pets: selectedPets,
        registrationDate: new Date().toISOString()
      });

      setShowLoggedInPetModal(false);
      setSelectedPets([]);
      setAlert({
        type: 'success',
        message: 'Te has registrado exitosamente para esta actividad'
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error al registrar:", error);
      setAlert({
        type: 'danger',
        message: 'Error al registrarse en la actividad. Por favor, intenta de nuevo.'
      });
    }
  };

  const handleGuestRegistration = async (formData) => {
    try {
      // Here you would typically make an API call to register the guest
      console.log("Registrando usuario invitado:", {
        activityId: selectedActivity.id,
        email: formData.email,
        cedula: formData.cedula,
        registrationDate: new Date().toISOString()
      });

      // Update UI after successful registration
      setShowRegistrationModal(false);
      setAlert({
        type: 'success',
        message: '¡Te has registrado exitosamente para esta actividad!'
      });
    } catch (error) {
      throw new Error('Error al registrar. Por favor intenta nuevamente.');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/actividades", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setAlert({
          type: 'success',
          message: '¡Actividad registrada exitosamente!'
        });
        setFormData(initialFormState);
        router.refresh();
      } else {
        setAlert({
          type: 'danger',
          message: 'Error al registrar la actividad. Por favor intente nuevamente.'
        });
      }
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Error de conexión. Por favor intente más tarde.'
      });
    }
  };

  const checkUserRegistration = async (activity) => {
    try {
      const { user } = await AuthController.getCurrentUser();
      if (user) {
        // Example of a registration that was just created (less than a day ago)
        const freshRegistration = {
          activityId: 4,
          userId: user.uid,
          registrationDate: new Date().toISOString(), // Today's date
          pets: [] // No pets selected in this registration
        };
        
        // Simulating different registration states
        if (activity.id === 1) {
          // Existing registration with pets
          setUserRegistration({
            activityId: activity.id,
            userId: user.uid,
            registrationDate: "2024-03-14T10:30:00Z",
            pets: [
              {
                id: "1",
                nombre: "Rocky",
                especie: "Perro",
                raza: "Golden Retriever"
              },
              {
                id: "2",
                nombre: "Luna",
                especie: "Gato",
                raza: "Siamés"
              }
            ]
          });
        } else if (activity.id === 4) {
          setUserRegistration(freshRegistration);
        } else {
          setUserRegistration(null);
        }
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      setUserRegistration(null);
    }
  };

  const handleUnregister = async () => {
    try {
      // This would be an API call in production
      console.log("Cancelando registro de la actividad:", selectedActivity.id);

      // Update available spots
      if (selectedActivity.tipoCapacidad === "limitada") {
        const updatedActivities = activities.map(act => {
          if (act.id === selectedActivity.id) {
            return {
              ...act,
              cuposDisponibles: act.cuposDisponibles + userRegistration.pets.length,
              estado: "activa"
            };
          }
          return act;
        });
        setActivities(updatedActivities);
      }

      setUserRegistration(null);
      setAlert({
        type: 'success',
        message: 'Has cancelado tu registro exitosamente'
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error al cancelar registro:", error);
      setAlert({
        type: 'danger',
        message: 'Error al cancelar el registro. Por favor, intenta de nuevo.'
      });
    }
  };

  const handleEditRegistration = () => {
    setSelectedPets(userRegistration.pets);
    setShowLoggedInPetModal(true);
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando actividades...</div>;
  }

  return (
    <div className="container mt-4">
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setAlert(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
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

        {showRegistrationModal && (
          <NotLoggedRegister
            show={showRegistrationModal}
            onHide={() => setShowRegistrationModal(false)}
            onRegister={handleGuestRegistration}
          />
        )}

        <Modal show={showLoggedInPetModal} onHide={() => setShowLoggedInPetModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Seleccionar Mascotas (Opcional)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted mb-3">
              Selecciona las mascotas que participarán en la actividad. Si no deseas registrar mascotas, puedes continuar sin seleccionar ninguna.
            </p>
            <ActivityPetSelector 
              pets={currentUser?.pets || {}}
              selectedPets={selectedPets}
              onPetSelect={handlePetSelect}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLoggedInPetModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleLoggedInRegistration}
            >
              {selectedPets.length > 0 
                ? `Registrarme con ${selectedPets.length} mascota(s)`
                : 'Registrarme sin mascotas'}
            </Button>
          </Modal.Footer>
        </Modal>

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

                {userRegistration ? (
                  <Card className="mt-4 border-primary">
                    <Card.Body>
                      <Card.Title className="text-primary">
                        Ya estás registrado en esta actividad
                      </Card.Title>
                      <div className="mb-3">
                        <strong>Fecha de registro:</strong>{' '}
                        {new Date(userRegistration.registrationDate).toLocaleString()}
                      </div>
                      <div className="mb-3">
                        <strong>Mascotas registradas:</strong>
                        {userRegistration.pets.length > 0 ? (
                          <ul className="list-unstyled mt-2">
                            {userRegistration.pets.map(pet => (
                              <li key={pet.id} className="d-flex align-items-center mb-2">
                                <span className="me-2">• {pet.nombre}</span>
                                <small className="text-muted">({pet.especie} - {pet.raza})</small>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mb-0 mt-2 text-muted">No registraste mascotas para esta actividad</p>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary"
                          onClick={handleEditRegistration}
                          disabled={new Date(`${selectedActivity.fecha}T${selectedActivity.hora}`) < new Date()}
                        >
                          Editar Registro
                        </Button>
                        <Button 
                          variant="outline-danger"
                          onClick={handleUnregister}
                          disabled={new Date(`${selectedActivity.fecha}T${selectedActivity.hora}`) < new Date()}
                        >
                          Cancelar Registro
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      onClick={() => handleRegistration(selectedActivity)}
                      disabled={
                        selectedActivity.estado === "finalizada" ||
                        selectedActivity.estado === "sin_cupos" ||
                        new Date(`${selectedActivity.fecha}T${selectedActivity.hora}`) < new Date()
                      }
                    >
                      {new Date(`${selectedActivity.fecha}T${selectedActivity.hora}`) < new Date()
                        ? "Actividad finalizada"
                        : "Registrarme en esta actividad"}
                    </Button>
                  </div>
                )}
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
  );
} 