"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Carousel, Form } from "react-bootstrap";
import Link from "next/link";

export default function Adopcion() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    tipoAnimal: "",
    peso: "",
    descripcion: "",
    contact: "",
    location: "",
    images: []
  });

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
      userName: "María González"
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
      userName: "Carlos Rodríguez"
    },
    {
      id: 3,
      nombre: "Rocky",
      tipoAnimal: "Perro",
      peso: "25.0",
      descripcion: "Rocky es un perro grande y protector. Ideal para familia con casa espaciosa. Está entrenado en comandos básicos y es muy obediente.",
      contact: "+506 6666-6666",
      location: "Cartago, Centro",
      date: "2024-03-13",
      images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb"],
      userId: "user1",
      userName: "María González"
    }
  ];

  useEffect(() => {
    const loadPets = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        let filteredPets = [...mockPets];
        if (showMyPosts) {
          filteredPets = filteredPets.filter(pet => pet.userId === "user1"); // Simulando usuario actual
        }
        setPets(filteredPets);
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, [showMyPosts]);

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setEditForm({
      nombre: pet.nombre,
      tipoAnimal: pet.tipoAnimal,
      peso: pet.peso,
      descripcion: pet.descripcion,
      contact: pet.contact,
      location: pet.location,
      images: pet.images
    });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Máximo 3 imágenes permitidas");
      return;
    }
    
    const mockImageUrls = files.map((_, index) => 
      `https://example.com/mock-image-${index + 1}.jpg`
    );
    
    setEditForm(prev => ({
      ...prev,
      images: mockImageUrls
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const updatedPets = pets.map(pet => {
        if (pet.id === selectedPet.id) {
          return {
            ...pet,
            ...editForm
          };
        }
        return pet;
      });
      setPets(updatedPets);
      setIsEditing(false);
      alert("Publicación actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar la publicación");
    }
  };

  const handleDeletePost = async () => {
    try {
      const updatedPets = pets.filter(pet => pet.id !== selectedPet.id);
      setPets(updatedPets);
      setShowModal(false);
      alert("Publicación eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar la publicación");
    }
  };

  const PetDetailModal = ({ pet, show, onHide }) => {
    if (!pet) return null;

    const tiposAnimales = [
      "Perro",
      "Gato",
      "Ave",
      "Conejo",
      "Hamster",
      "Otro"
    ];

    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{pet.nombre} - {pet.tipoAnimal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pet.images && pet.images.length > 0 && (
            <Carousel className="mb-4">
              {pet.images.map((image, index) => (
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
          
          {isEditing && pet.userId === "user1" ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Animal</Form.Label>
                <Form.Select
                  value={editForm.tipoAnimal}
                  onChange={(e) => setEditForm({...editForm, tipoAnimal: e.target.value})}
                >
                  {tiposAnimales.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={editForm.peso}
                  onChange={(e) => setEditForm({...editForm, peso: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Contacto</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.contact}
                  onChange={(e) => setEditForm({...editForm, contact: e.target.value})}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Ubicación</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Imágenes actuales</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {editForm.images.map((image, index) => (
                    <div key={index} className="position-relative">
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        className="rounded"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                {editForm.images.length < 3 && (
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                )}
                <Form.Text className="text-muted">
                  Puede subir hasta 3 imágenes
                </Form.Text>
              </Form.Group>
            </Form>
          ) : (
            <>
              <div className="mb-3">
                <h5>Descripción</h5>
                <p>{pet.descripcion}</p>
              </div>
              <div className="mb-3">
                <h5>Peso</h5>
                <p>{pet.peso} kg</p>
              </div>
              <div className="mb-3">
                <h5>Ubicación</h5>
                <p>{pet.location}</p>
              </div>
              <div className="mb-3">
                <h5>Contacto</h5>
                <p>{pet.contact}</p>
              </div>
              <div className="mb-3">
                <h5>Fecha de Publicación</h5>
                <p>{new Date(pet.date).toLocaleDateString()}</p>
              </div>
              <div className="mb-3">
                <h5>Publicado por</h5>
                <p>{pet.userName}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {pet.userId === "user1" && (
            <>
              {isEditing ? (
                <>
                  <Button variant="primary" onClick={handleEditSubmit}>
                    Guardar Cambios
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={handleDeletePost}>
                    Eliminar
                  </Button>
                </>
              )}
            </>
          )}
          <Button variant="secondary" onClick={() => {
            onHide();
            setIsEditing(false);
          }}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

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
        Adopción de Mascotas
      </h1>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button
            variant={showMyPosts ? "primary" : "secondary"}
            className="rounded-pill"
            style={{ padding: "10px 20px" }}
            onClick={() => setShowMyPosts(!showMyPosts)}
          >
            Mis Publicaciones
          </Button>
        </div>
        <Link href="/adopcion/crear" passHref>
          <Button 
            variant="success" 
            className="rounded-pill"
            style={{ padding: "10px 20px" }}
          >
            Publicar en Adopción
          </Button>
        </Link>
      </div>

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
                </div>
                <div className="card-body">
                  <h5 className="card-title text-center mb-2">{pet.nombre}</h5>
                  <p className="text-muted text-center mb-2">{pet.tipoAnimal}</p>
                  <p className="card-text">
                    {pet.descripcion.substring(0, 100)}
                    {pet.descripcion.length > 100 ? "..." : ""}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      📍 {pet.location}
                    </small>
                  </p>
                </div>
                <div className="card-footer bg-transparent">
                  <small className="text-muted">{new Date(pet.date).toLocaleDateString()}</small>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <PetDetailModal
        pet={selectedPet}
        show={showModal}
        onHide={() => setShowModal(false)}
      />

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
