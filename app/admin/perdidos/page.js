"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Carousel, Form, Badge } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthController from "@/controllers/AuthController";
import LostPetController from "@/controllers/LostPetController";
import { BsGeoAlt, BsCalendar, BsTelephone, BsPerson } from "react-icons/bs";
import { toast } from "react-toastify";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export default function AdminPerdidos() {
  const router = useRouter();
  const [lostPets, setLostPets] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingStateChange, setPendingStateChange] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMyPosts, setShowMyPosts] = useState(false);

  useEffect(() => {
    let unsubscribe;
    const loadPets = async () => {
      try {
        const { user } = await AuthController.getCurrentUser();
        setCurrentUser(user);
        
        unsubscribe = await LostPetController.getAllLostPets((petsData) => {
          if (showMyPosts && user) {
            const filtered = Object.fromEntries(
              Object.entries(petsData).filter(([_, pet]) => pet.userId === user.uid)
            );
            setLostPets(filtered);
          } else {
            setLostPets(petsData);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Error loading lost pets:", error);
        setLoading(false);
      }
    };
    loadPets();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [showMyPosts]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      Perdido: "danger",
      Encontrado: "success",
      "En peligro": "warning",
      Herido: "warning",
      Avistado: "info"
    };
    return (
      <Badge bg={statusStyles[status]} className="mb-2">
        {status}
      </Badge>
    );
  };

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleStateChange = async () => {
    try {
      const result = await LostPetController.updateLostPetStatus(selectedPet.id, pendingStateChange);

      if (result.success) {
        setLostPets(prev => ({
          ...prev,
          [selectedPet.id]: {
            ...prev[selectedPet.id],
            status: pendingStateChange
          }
        }));

        setSelectedPet(prev => ({
          ...prev,
          status: pendingStateChange
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

  const handleDeleteClick = (pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await LostPetController.deleteLostPet({
        petId: petToDelete.id,
        photos: petToDelete.photos
      });

      setLostPets(prev => {
        const updated = { ...prev };
        delete updated[petToDelete.id];
        return updated;
      });

      setShowDeleteModal(false);
      setShowModal(false);
      setPetToDelete(null);
      toast.success('Publicación eliminada exitosamente');
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error('Error al eliminar la publicación');
    }
  };

  if (loading) {
    return <div className="text-center">Cargando publicaciones...</div>;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <h1 style={{ color: "#2055A5" }}>Administrar Animales Perdidos</h1>
        <div className="d-flex gap-3">
          <Button 
            variant="outline-primary"
            onClick={() => setShowMyPosts(!showMyPosts)}
          >
            {showMyPosts ? "Ver todas" : "Ver mis publicaciones"}
          </Button>
          <Link href="/admin/perdidos/crear" passHref>
            <Button variant="primary">Nueva Publicación</Button>
          </Link>
        </div>
      </div>

      {Object.values(lostPets).length === 0 ? (
        <div className="text-center">
          <h2>No hay mascotas reportadas</h2>
        </div>
      ) : (
        <Row className="g-4 px-2">
          {Object.values(lostPets).map((post) => (
            <Col key={post.id} xs={12} md={6} lg={4}>
              <Card 
                className="shadow-sm hover-shadow h-100" 
                style={{ cursor: "pointer" }}
                onClick={() => handlePetClick(post)}
              >
                <Card.Body>
                  <Row>
                    <Col xs={12}>
                      {post.photos && post.photos.length > 0 && (
                        <img
                          src={post.photos[0]}
                          alt="Mascota"
                          className="img-fluid rounded w-100 mb-3"
                          style={{ 
                            height: "200px", 
                            objectFit: "cover" 
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder-pet.jpg";
                          }}
                        />
                      )}
                    </Col>
                    <Col xs={12}>
                      <div className="d-flex align-items-center mb-2">
                        {getStatusBadge(post.status)}
                        <span className="ms-2 text-muted">{post.tipoAnimal}</span>
                      </div>
                      <div className="mb-2 d-flex align-items-center">
                        <BsCalendar className="me-2" />
                        <small className="text-muted">
                          {formatDateTime(post.date || post.createdAt)}
                        </small>
                      </div>
                      <p className="card-text">
                        {post.descripcion.substring(0, 100)}
                        {post.descripcion.length > 100 ? "..." : ""}
                      </p>
                      <p className="card-text">
                        <BsGeoAlt className="me-2" />
                        <small className="text-muted">{post.location}</small>
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        {selectedPet && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedPet.tipoAnimal} - {selectedPet.status}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Carousel className="mb-4">
                {selectedPet.photos && selectedPet.photos.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      style={{ 
                        height: "400px",
                        width: "100%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder-pet.jpg";
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
              
              <div className="mb-3">
                <h5>Estado</h5>
                {getStatusBadge(selectedPet.status)}
              </div>

              <div className="mb-3">
                <h5>Descripción</h5>
                <p>{selectedPet.descripcion}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsGeoAlt className="me-2" />
                  <h5 className="mb-0">Ubicación</h5>
                </div>
                <p>{selectedPet.location}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsTelephone className="me-2" />
                  <h5 className="mb-0">Contacto</h5>
                </div>
                <p>{selectedPet.contact}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsCalendar className="me-2" />
                  <h5 className="mb-0">Fecha de Reporte</h5>
                </div>
                <p>{formatDateTime(selectedPet.date || selectedPet.createdAt)}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsPerson className="me-2" />
                  <h5 className="mb-0">Reportado por</h5>
                </div>
                <p>{selectedPet.userName}</p>
              </div>

            </Modal.Body>
            <Modal.Footer>
            <div className="d-flex align-items-center gap-2 me-auto">
                <small className="text-muted">Editar Estado:</small>
                <div className="d-flex align-items-center gap-2">
                  <Form.Select
                    value={pendingStateChange || selectedPet.status}
                    onChange={(e) => setPendingStateChange(e.target.value)}
                    style={{ width: 'auto' }}
                    size="sm"
                  >
                    <option value="Perdido">Perdido</option>
                    <option value="Encontrado">Encontrado</option>
                    <option value="En peligro">En peligro</option>
                    <option value="Herido">Herido</option>
                    <option value="Avistado">Avistado</option>
                  </Form.Select>
                  {pendingStateChange && pendingStateChange !== selectedPet.status && (
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
              {currentUser && selectedPet.userId === currentUser.uid && (
                <Link href={`/admin/perdidos/editar/${selectedPet.id}`} passHref>
                  <Button variant="primary">
                    Editar
                  </Button>
                </Link>
              )}
              <Button 
                variant="danger" 
                onClick={() => handleDeleteClick(selectedPet)}
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

      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h4>¿Está seguro que desea eliminar esta publicación?</h4>
            <p className="text-muted">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
          >
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