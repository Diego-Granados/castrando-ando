"use client";
import { useEffect, useState } from "react";
import { Row, Col, Button, Badge, Modal, Carousel, Form } from "react-bootstrap";
import Link from "next/link";
import AuthController from "@/controllers/AuthController";

export default function AnimalesPerdidos() {
  const [petPosts, setPetPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editForm, setEditForm] = useState({
    estado: "",
    descripcion: "",
    contact: "",
    location: "",
    images: []
  });

  // Sample data for testing
  const sampleData = [
    {
      id: "1",
      tipoAnimal: "Perro",
      status: "Perdido",
      descripcion: "Perro labrador color dorado, responde al nombre de Max. Tiene un collar azul con placa de identificación. Muy amigable con las personas. Se perdió cerca del parque central. Tiene una marca distintiva en su pata delantera derecha.",
      location: "Barrio Los Yoses, San Pedro",
      contact: "+506 8888-1234",
      date: "15/02/2024",
      userName: "María González",
      userId: "user1",
      images: [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1924&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop"
      ]
    },
    {
      id: "2",
      tipoAnimal: "Gato",
      status: "Encontrado",
      descripcion: "Encontré este gato siamés en el vecindario. Muy bien cuidado, tiene collar pero sin identificación. Es muy cariñoso y parece ser casero. Está siendo alimentado y cuidado temporalmente.",
      location: "Curridabat, cerca de Plaza del Sol",
      contact: "+506 7777-5678",
      date: "16/02/2024",
      userName: "Carlos Rodríguez",
      userId: "user2",
      images: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop"
      ]
    },
    {
      id: "3",
      tipoAnimal: "Perro",
      status: "En peligro",
      descripcion: "Perro herido visto en la zona, parece ser un pastor alemán. Está cojeando de la pata trasera y necesita atención veterinaria urgente. Se ve asustado pero no agresivo. Por favor, si alguien puede ayudar a rescatarlo.",
      location: "Sabanilla, UCR",
      contact: "+506 6666-9012",
      date: "17/02/2024",
      userName: "Ana Jiménez",
      userId: "user3",
      images: [
        "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1974&auto=format&fit=crop"
      ]
    },
    {
      id: "4",
      tipoAnimal: "Ave",
      status: "Perdido",
      descripcion: "Perico verde con anillo en la pata derecha. Responde al nombre de 'Kiwi'. Es muy parlanchín y puede decir 'hola' y 'adiós'. Se escapó por una ventana abierta. Recompensa por su encuentro.",
      location: "Barrio Escalante",
      contact: "+506 9999-3456",
      date: "17/02/2024",
      userName: "Pedro Mora",
      userId: "user4",
      images: [
        "https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=80&w=1925&auto=format&fit=crop"
      ]
    },
    {
      id: "5",
      tipoAnimal: "Gato",
      status: "Avistado",
      descripcion: "Gato naranja con manchas blancas visto frecuentemente en la zona. Parece estar perdido o abandonado. Se le ha visto buscando comida en los alrededores. Tiene una cola muy esponjosa y es de tamaño mediano.",
      location: "San Pedro, Mall San Pedro",
      contact: "+506 8888-7890",
      date: "18/02/2024",
      userName: "Laura Vargas",
      userId: "user5",
      images: [
        "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop"
      ]
    }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await AuthController.getCurrentUser();
        setIsAuthenticated(true);
        setCurrentUser(user);
      } catch (error) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setShowMyPosts(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const loadPets = async () => {
      try {
        let filteredPosts = [...sampleData];
        
        if (showMyPosts && currentUser) {
          filteredPosts = filteredPosts.filter(pet => pet.userId === currentUser.uid);
        }
        
        setPetPosts(filteredPosts);
      } catch (error) {
        console.error("Error cargando mascotas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPets();
  }, [showMyPosts, currentUser]);

  if (loading) {
    return <div className="text-center">Cargando publicaciones...</div>;
  }

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
    setEditForm({
      estado: pet.status,
      descripcion: pet.descripcion,
      contact: pet.contact,
      location: pet.location,
      images: [...pet.images]
    });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentImages = editForm.images || [];
    
    if (currentImages.length + files.length > 3) {
      alert("Solo se permiten hasta 3 imágenes por publicación");
      return;
    }

    // Simular URLs de imágenes para demostración
    const newImageUrls = files.map(() => 
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1924&auto=format&fit=crop"
    );

    setEditForm({
      ...editForm,
      images: [...currentImages, ...newImageUrls]
    });
  };

  const handleRemoveImage = (index) => {
    const newImages = editForm.images.filter((_, i) => i !== index);
    setEditForm({
      ...editForm,
      images: newImages
    });
  };

  const handleEditSubmit = async () => {
    try {
      // Update local state directly
      const updatedPosts = petPosts.map(post => {
        if (post.id === selectedPet.id) {
          return {
            ...post,
            status: editForm.estado,
            descripcion: editForm.descripcion,
            contact: editForm.contact,
            location: editForm.location,
            images: editForm.images
          };
        }
        return post;
      });
      setPetPosts(updatedPosts);
      
      setIsEditing(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error actualizando mascota:", error);
      alert("Error al actualizar la publicación");
    }
  };

  const PetDetailModal = ({ pet, show, onHide }) => {
    if (!pet) return null;

    const estadosAnimales = [
      "Perdido",
      "Encontrado",
      "En peligro",
      "Herido",
      "Avistado"
    ];
    
    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{pet.tipoAnimal} {!isEditing && pet.status}</Modal.Title>
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
          
          {isEditing ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={editForm.estado}
                  onChange={(e) => setEditForm({...editForm, estado: e.target.value})}
                >
                  {estadosAnimales.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </Form.Select>
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
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={editForm.images.length >= 3}
                />
                <Form.Text className="text-muted">
                  Máximo 3 imágenes por publicación
                </Form.Text>
              </Form.Group>
            </Form>
          ) : (
            <>
              <div className="mb-3">
                <h5>Estado</h5>
                {getStatusBadge(pet.status)}
              </div>
              <div className="mb-3">
                <h5>Descripción</h5>
                <p>{pet.descripcion}</p>
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
                <h5>Fecha de Reporte</h5>
                <p>{pet.date}</p>
              </div>
              <div className="mb-3">
                <h5>Reportado por</h5>
                <p>{pet.userName}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isAuthenticated && pet.userId === "user1" && ( // For testing, assuming current user is user1
            <>
              {isEditing ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleEditSubmit}
                  >
                    Guardar Cambios
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      LostPetController.markAsFound(pet.id);
                      onHide();
                    }}
                  >
                    Marcar como encontrado
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      LostPetController.delete(pet.id, pet.images);
                      onHide();
                    }}
                  >
                    Eliminar
                  </Button>
                </>
              )}
            </>
          )}
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <main className="container">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Animales Perdidos
      </h1>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {isAuthenticated && (
            <Button
              variant={showMyPosts ? "primary" : "secondary"}
              className="rounded-pill"
              style={{ padding: "10px 20px" }}
              onClick={() => setShowMyPosts(!showMyPosts)}
            >
              Mis Publicaciones
            </Button>
          )}
        </div>
        <Link href="/animales_perdidos/crear" passHref>
          <Button 
            variant="success" 
            className="rounded-pill"
            style={{ padding: "10px 20px" }}
          >
            Reportar
          </Button>
        </Link>
      </div>

      {petPosts.length === 0 ? (
        <div className="text-center">
          <h2>No hay mascotas reportadas</h2>
        </div>
      ) : (
        <Row className="g-4">
          {petPosts.map((post) => (
            <Col key={post.id} xs={12}>
              <div 
                className="card shadow-sm hover-shadow" 
                style={{ cursor: "pointer" }}
                onClick={() => handlePetClick(post)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center mb-2">
                        {getStatusBadge(post.status)}
                        <span className="ms-2 text-muted">{post.tipoAnimal}</span>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">{post.date}</small>
                      </div>
                      <p className="card-text">
                        {post.descripcion.substring(0, 150)}
                        {post.descripcion.length > 150 ? "..." : ""}
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          📍 {post.location}
                        </small>
                      </p>
                    </div>
                    <div className="col-md-4">
                      {post.images && post.images.length > 0 && (
                        <img
                          src={post.images[0]}
                          alt="Mascota"
                          className="img-fluid rounded"
                          style={{ objectFit: "cover", height: "200px", width: "100%" }}
                        />
                      )}
                    </div>
                  </div>
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
    </main>
  );
}