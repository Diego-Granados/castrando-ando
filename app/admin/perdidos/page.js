"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal, Carousel, Form } from "react-bootstrap";
import { BsCalendar, BsGeoAlt, BsTelephone, BsPerson, BsClock } from "react-icons/bs";
import Link from "next/link";

export default function AdminPerdidos() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    estado: ""
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    // Simular carga de datos
    const samplePosts = [
      {
        id: 1,
        tipoAnimal: "Perro",
        status: "Perdido",
        descripcion: "Se perdió en el parque de la Sabana. Responde al nombre de Max. Es muy amigable y le gusta jugar con otros perros. Tiene un collar azul con su placa de identificación.",
        location: "Parque La Sabana, San José",
        contact: "8888-8888",
        date: "2024-03-20",
        userName: "María González",
        userId: "user1",
        images: [
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
          "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500"
        ]
      },
      {
        id: 2,
        tipoAnimal: "Gato",
        status: "Encontrado",
        descripcion: "Se perdió cerca del Mall Oxígeno. Es un gato negro con manchas blancas en el pecho y las patas. Es muy tímido pero cariñoso. Responde al nombre de Oreo.",
        location: "Mall Oxígeno, Heredia Centro",
        contact: "7777-7777",
        date: "2024-03-19",
        userName: "Juan Pérez",
        userId: "user2",
        images: [
          "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500",
          "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500"
        ]
      }
    ];
    
    setPosts(samplePosts);
    setLoading(false);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      alert("Publicación eliminada exitosamente");
      if (showModal) setShowModal(false);
    }
  };

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

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setEditForm({
      estado: post.status
    });
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const updatedPosts = posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            status: editForm.estado
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setIsEditing(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error actualizando publicación:", error);
      alert("Error al actualizar la publicación");
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete.id));
      setShowDeleteModal(false);
      setShowModal(false);
      alert("Publicación eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar la publicación");
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
          Administrar Publicaciones de Mascotas Perdidas
        </h1>
        <p className="text-center">Cargando publicaciones...</p>
      </Container>
    );
  }

  const estadosAnimales = [
    "Perdido",
    "Encontrado",
    "En peligro",
    "Herido",
    "Avistado"
  ];

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Administrar Publicaciones de Mascotas Perdidas
      </h1>

      <Row>
        {posts.map(post => (
          <Col key={post.id} lg={4} md={6} className="mb-4">
            <Card 
              className="h-100 shadow-sm" 
              style={{ cursor: "pointer" }}
              onClick={() => handlePostClick(post)}
            >
              {post.images && post.images.length > 0 && (
                <Card.Img 
                  variant="top" 
                  src={post.images[0]} 
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title>{post.tipoAnimal}</Card.Title>
                  {getStatusBadge(post.status)}
                </div>
                <Card.Text className="text-muted mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <BsGeoAlt className="me-2" />
                    {post.location}
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <BsCalendar className="me-2" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="d-flex align-items-center">
                    <BsPerson className="me-2" />
                    {post.userName}
                  </div>
                </Card.Text>
                <div className="mt-auto">
                  <Button
                    variant="outline-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostClick(post);
                    }}
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

      {posts.length === 0 && (
        <p className="text-center">No hay publicaciones de mascotas perdidas.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        {selectedPost && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedPost.tipoAnimal} {!isEditing && selectedPost.status}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedPost.images && selectedPost.images.length > 0 && (
                <Carousel className="mb-4">
                  {selectedPost.images.map((image, index) => (
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
                </Form>
              ) : (
                <>
                  <div className="mb-3">
                    <h5>Estado</h5>
                    {getStatusBadge(selectedPost.status)}
                  </div>
                  <div className="mb-3">
                    <h5>Descripción</h5>
                    <p>{selectedPost.descripcion}</p>
                  </div>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="mb-2">
                        <BsGeoAlt className="me-2" />
                        <strong>Ubicación:</strong>
                        <br />
                        {selectedPost.location}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-2">
                        <BsCalendar className="me-2" />
                        <strong>Fecha:</strong>
                        <br />
                        {new Date(selectedPost.date).toLocaleDateString()}
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-2">
                    <BsTelephone className="me-2" />
                    <strong>Contacto:</strong>
                    <br />
                    {selectedPost.contact}
                  </div>

                  <div className="mb-4">
                    <BsPerson className="me-2" />
                    <strong>Publicado por:</strong>
                    <br />
                    {selectedPost.userName}
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => setIsEditing(true)}
                      className="flex-grow-1"
                    >
                      Cambiar Estado
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(selectedPost)}
                      className="flex-grow-1"
                    >
                      Eliminar Publicación
                    </Button>
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              {isEditing ? (
                <>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleEditSubmit}>
                    Guardar cambios
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </Button>
              )}
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
        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </Container>
  );
} 