"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Carousel, Form, Badge } from "react-bootstrap";
import { BsCalendar, BsGeoAlt, BsTelephone, BsPerson } from "react-icons/bs";

export default function AdminAdopcion() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const mockPets = [
    {
      id: 1,
      nombre: "Luna",
      tipoAnimal: "Perro",
      peso: "12.5",
      descripcion: "Luna es una perrita muy cariñosa y juguetona. Tiene 2 años y está esterilizada. Es excelente con niños y otros perros.",
      contact: "+506 8888-8888",
      location: "San José, Barrio Los Yoses",
      date: "2024-03-15",
      images: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1"],
      userId: "user1",
      userName: "María González",
      estado: "Buscando Hogar"
    },
    {
      id: 2,
      nombre: "Milo",
      tipoAnimal: "Gato",
      peso: "4.2",
      descripcion: "Milo es un gatito muy tranquilo y limpio. Tiene 1 año y está vacunado. Es perfecto para apartamento y usa su arenero correctamente.",
      contact: "+506 7777-7777",
      location: "Heredia, San Francisco",
      date: "2024-03-14",
      images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"],
      userId: "user2",
      userName: "Carlos Rodríguez",
      estado: "Adoptado"
    }
  ];

  useEffect(() => {
    const loadPets = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPets(mockPets);
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleDeleteClick = (pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const updatedPets = pets.filter(pet => pet.id !== petToDelete.id);
      setPets(updatedPets);
      setShowDeleteModal(false);
      setShowModal(false);
      alert("Publicación eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar la publicación");
    }
  };

  const getStatusBadge = (estado) => {
    const statusStyles = {
      "Buscando Hogar": "success",
      Adoptado: "secondary",
      "En proceso": "warning"
    };
    return (
      <Badge bg={statusStyles[estado]} className="mb-2">
        {estado}
      </Badge>
    );
  };

  const tiposAnimales = [
    "Perro",
    "Gato",
    "Ave",
    "Conejo",
    "Hamster",
    "Otro"
  ];

  const estadosAdopcion = [
    "Buscando Hogar",
    "En proceso",
    "Adoptado"
  ];

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <h2>Cargando publicaciones...</h2>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Administrar Adopciones
      </h1>

      {pets.length === 0 ? (
        <div className="text-center">
          <h2>No hay mascotas en adopción</h2>
        </div>
      ) : (
        <Row className="g-4">
          {pets.map((pet) => (
            <Col key={pet.id} xs={12} md={6} lg={4}>
              <div 
                className="card h-100 shadow-sm hover-shadow" 
                style={{ cursor: "pointer" }}
                onClick={() => handlePetClick(pet)}
              >
                <div className="position-relative">
                  {pet.images && pet.images.length > 0 && (
                    <img
                      src={pet.images[0]}
                      alt="Mascota"
                      className="card-img-top"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  )}
                  <div className="position-absolute top-0 end-0 m-2">
                    {getStatusBadge(pet.estado)}
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title text-center mb-2">{pet.nombre}</h5>
                  <p className="text-muted text-center mb-2">{pet.tipoAnimal}</p>
                  <p className="card-text">
                    {pet.descripcion.substring(0, 100)}
                    {pet.descripcion.length > 100 ? "..." : ""}
                  </p>
                  <div className="d-flex align-items-center mb-2">
                    <BsGeoAlt className="me-2" />
                    <small className="text-muted">{pet.location}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <BsCalendar className="me-2" />
                    <small className="text-muted">{new Date(pet.date).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
      }} size="lg">
        {selectedPet && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedPet.nombre} - {selectedPet.tipoAnimal}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedPet.images && selectedPet.images.length > 0 && (
                <Carousel className="mb-4">
                  {selectedPet.images.map((image, index) => (
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
              
              <div className="mb-3">
                <h5>Estado de Adopción</h5>
                {getStatusBadge(selectedPet.estado)}
              </div>
              <div className="mb-3">
                <h5>Descripción</h5>
                <p>{selectedPet.descripcion}</p>
              </div>
              <div className="mb-3">
                <h5>Peso</h5>
                <p>{selectedPet.peso} kg</p>
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
                  <h5 className="mb-0">Fecha de Publicación</h5>
                </div>
                <p>{new Date(selectedPet.date).toLocaleDateString()}</p>
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <BsPerson className="me-2" />
                  <h5 className="mb-0">Publicado por</h5>
                </div>
                <p>{selectedPet.userName}</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => handleDeleteClick(selectedPet)}>
                Eliminar Publicación
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
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