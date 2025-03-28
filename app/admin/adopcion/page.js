"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Carousel, Form, Badge } from "react-bootstrap";
import { BsCalendar, BsGeoAlt, BsTelephone, BsPerson } from "react-icons/bs";
import Link from "next/link";
import AuthController from "@/controllers/AuthController";
import AdoptionController from "@/controllers/AdoptionController";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AdminAdopcion() {
  const router = useRouter();
  const [adoptions, setAdoptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adoptionToDelete, setAdoptionToDelete] = useState(null);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingStateChange, setPendingStateChange] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const initialize = async () => {
      try {
        let user = null;
        try {
          const authData = await AuthController.getCurrentUser();
          user = authData.user;
          setIsAuthenticated(true);
          setCurrentUser(user);
        } catch (error) {
          console.error("Error de autenticación:", error);
          router.push('/userlogin');
          return;
        }

        // Obtener adopciones
        unsubscribe = await AdoptionController.getAllAdoptions((adoptionsData) => {
          if (showMyPosts && user) {
            const filtered = Object.fromEntries(
              Object.entries(adoptionsData).filter(([_, adoption]) => adoption.userId === user.uid)
            );
            setAdoptions(filtered);
          } else {
            setAdoptions(adoptionsData);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Error loading adoptions:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    initialize();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [showMyPosts, router]);

  const handleAdoptionClick = (adoption) => {
    setSelectedAdoption(adoption);
    setShowModal(true);
  };

  const handleDeleteClick = (adoption) => {
    setAdoptionToDelete(adoption);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await AdoptionController.deleteAdoption({
        adoptionId: adoptionToDelete.id,
        photos: adoptionToDelete.photos
      });

      setAdoptions(prev => {
        const updated = { ...prev };
        delete updated[adoptionToDelete.id];
        return updated;
      });

      setShowDeleteModal(false);
      setShowModal(false);
      setAdoptionToDelete(null);
      toast.success('Publicación eliminada exitosamente');
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error('Error al eliminar la publicación');
    }
  };

  const handleStateChange = async () => {
    try {
      const result = await AdoptionController.updateAdoptionStatus(selectedAdoption.id, pendingStateChange);

      if (result.success) {
        setAdoptions(prev => ({
          ...prev,
          [selectedAdoption.id]: {
            ...prev[selectedAdoption.id],
            estado: pendingStateChange
          }
        }));

        setSelectedAdoption(prev => ({
          ...prev,
          estado: pendingStateChange
        }));

        setPendingStateChange(null);
        toast.success('Estado actualizado exitosamente');
      } else {
        throw new Error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error('Error al actualizar el estado');
      setPendingStateChange(null);
    }
  };

  const getStatusBadgeVariant = (estado) => {
    switch (estado) {
      case "Buscando Hogar":
        return "success";
      case "En proceso":
        return "warning";
      case "Adoptado":
        return "secondary";
      default:
        return "primary";
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h2>Cargando publicaciones...</h2>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">
          Error al cargar las publicaciones: {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Administrar Publicaciones de Adopción
      </h1>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          variant={showMyPosts ? "primary" : "outline-primary"}
          onClick={() => setShowMyPosts(!showMyPosts)}
        >
          {showMyPosts ? "Ver todas" : "Ver mis publicaciones"}
        </Button>
        <Link href="/admin/adopcion/crear" passHref>
          <Button variant="success">Nueva Publicación</Button>
        </Link>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {Object.values(adoptions).map((adoption) => (
          <Col key={adoption.id}>
            <Card className="h-100 shadow-sm hover-shadow">
              {adoption.photos?.[0] && (
                <div style={{ position: "relative", height: "200px" }}>
                  <img
                    src={adoption.photos[0]}
                    alt={adoption.nombre}
                    style={{ width: '100%', height: '100%', objectFit: "cover" }}
                  />
                </div>
              )}
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <Card.Title>{adoption.nombre}</Card.Title>
                  <Badge bg={getStatusBadgeVariant(adoption.estado)}>
                    {adoption.estado}
                  </Badge>
                </div>
                <div>
                  <strong>Tipo:</strong> {adoption.tipoAnimal}<br />
                  <strong>Edad:</strong> {adoption.edad} años<br />
                  <strong>Ubicación:</strong> {adoption.location}
                </div>
                <div className="mt-2">{adoption.descripcion}</div>
                <Button 
                  variant="outline-primary" 
                  onClick={() => handleAdoptionClick(adoption)}
                  className="w-100 mt-3"
                >
                  Ver más detalles
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de detalles */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setPendingStateChange(null);
      }} size="lg">
        {selectedAdoption && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedAdoption.nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedAdoption.photos && selectedAdoption.photos.length > 0 && (
                <Carousel className="mb-4">
                  {selectedAdoption.photos.map((photo, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}

              <div className="mb-3">
                <h5>Estado de Adopción</h5>
                <Badge bg={getStatusBadgeVariant(selectedAdoption.estado)}>
                  {selectedAdoption.estado}
                </Badge>
              </div>

              <div className="mb-3">
                <h5>Descripción</h5>
                <p>{selectedAdoption.descripcion}</p>
              </div>

              <div className="mb-3">
                <h5>Peso</h5>
                <p>{selectedAdoption.peso} kg</p>
              </div>

              <div className="mb-3">
                <h5>Edad</h5>
                <p>{selectedAdoption.edad ? `${selectedAdoption.edad} años` : 'N/A'}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsGeoAlt className="me-2" />
                  <h5 className="mb-0">Ubicación</h5>
                </div>
                <p>{selectedAdoption.location}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsTelephone className="me-2" />
                  <h5 className="mb-0">Contacto</h5>
                </div>
                <p>{selectedAdoption.contact}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsCalendar className="me-2" />
                  <h5 className="mb-0">Fecha de Publicación</h5>
                </div>
                <p>{new Date(selectedAdoption.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsPerson className="me-2" />
                  <h5 className="mb-0">Publicado por</h5>
                </div>
                <p>{selectedAdoption.userName}</p>
              </div>

            </Modal.Body>
            <Modal.Footer>

              <div className="d-flex align-items-center gap-2 me-auto">
                <small className="text-muted">Editar Estado:</small>
                <div className="d-flex align-items-center gap-2">
                  <Form.Select
                    value={pendingStateChange || selectedAdoption.estado}
                    onChange={(e) => setPendingStateChange(e.target.value)}
                    style={{ width: 'auto' }}
                    size="sm"
                  >
                    <option value="Buscando Hogar">Buscando Hogar</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Adoptado">Adoptado</option>
                  </Form.Select>
                  {pendingStateChange && pendingStateChange !== selectedAdoption.estado && (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={handleStateChange}
                    >
                      Confirmar Cambio
                    </Button>
                  )}
                </div>
              </div>
              <Link href={`/admin/adopcion/editar/${selectedAdoption.id}`} passHref>
                <Button variant="primary">
                  Editar
                </Button>
              </Link>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteClick(selectedAdoption)}
              >
                Eliminar
              </Button>
              <Button variant="secondary" onClick={() => {
                setShowModal(false);
                setPendingStateChange(null);
              }}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar esta publicación? Esta acción no se puede deshacer.
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