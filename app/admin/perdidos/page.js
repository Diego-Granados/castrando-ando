"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal, Carousel, SSRProvider } from "react-bootstrap";
import { BsCalendar, BsGeoAlt, BsTelephone, BsPerson, BsClock } from "react-icons/bs";

export default function AdminPerdidos() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    // Simular carga de datos
    const samplePosts = [
      {
        id: 1,
        titulo: "Perro perdido en Sabana",
        descripcion: "Se perdió en el parque de la Sabana. Responde al nombre de Max. Es muy amigable y le gusta jugar con otros perros. Tiene un collar azul con su placa de identificación.",
        tipo: "Perro",
        raza: "Golden Retriever",
        ubicacion: "Parque La Sabana, San José",
        contacto: "8888-8888",
        imagenes: [
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
          "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500"
        ],
        usuario: {
          id: "user1",
          nombre: "María González"
        },
        estado: "perdido",
        createdAt: "2024-03-20"
      },
      {
        id: 2,
        titulo: "Gato perdido en Heredia",
        descripcion: "Se perdió cerca del Mall Oxígeno. Es un gato negro con manchas blancas en el pecho y las patas. Es muy tímido pero cariñoso. Responde al nombre de Oreo.",
        tipo: "Gato",
        raza: "Doméstico",
        ubicacion: "Mall Oxígeno, Heredia Centro",
        contacto: "7777-7777",
        imagenes: [
          "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500",
          "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500"
        ],
        usuario: {
          id: "user2",
          nombre: "Juan Pérez"
        },
        estado: "encontrado",
        createdAt: "2024-03-19"
      }
    ];
    
    setPosts(samplePosts);
    setLoading(false);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      // Simular eliminación
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      alert("Publicación eliminada exitosamente");
      if (showModal) setShowModal(false);
    }
  };

  const getEstadoBadge = (estado) => {
    return estado === "perdido" ? 
      <Badge bg="danger">Perdido</Badge> : 
      <Badge bg="success">Encontrado</Badge>;
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  if (loading) {
    return (
      <SSRProvider>
        <Container className="py-4">
          <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
            Administrar Publicaciones de Mascotas Perdidas
          </h1>
          <p className="text-center">Cargando publicaciones...</p>
        </Container>
      </SSRProvider>
    );
  }

  return (
    <SSRProvider>
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
                <Card.Img 
                  variant="top" 
                  src={post.imagenes[0]} 
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{post.titulo}</Card.Title>
                    {getEstadoBadge(post.estado)}
                  </div>
                  <Card.Text className="text-truncate">
                    {post.descripcion}
                  </Card.Text>
                  <div className="d-flex align-items-center mb-2">
                    <BsGeoAlt className="me-2" />
                    <small>{post.ubicacion}</small>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <BsCalendar className="me-2" />
                    <small>{new Date(post.createdAt).toLocaleDateString()}</small>
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
                  {selectedPost.titulo}
                  <div className="mt-2">
                    {getEstadoBadge(selectedPost.estado)}
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col md={6}>
                    <Carousel>
                      {selectedPost.imagenes.map((img, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={img}
                            alt={`${selectedPost.titulo} ${index + 1}`}
                            className="d-block w-100 rounded"
                            style={{ height: "300px", objectFit: "cover" }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </Col>
                  <Col md={6}>
                    <h5>Descripción</h5>
                    <p>{selectedPost.descripcion}</p>
                    
                    <h5>Detalles</h5>
                    <div className="mb-2">
                      <BsPerson className="me-2" />
                      <strong>Tipo:</strong> {selectedPost.tipo} - {selectedPost.raza}
                    </div>
                    <div className="mb-2">
                      <BsGeoAlt className="me-2" />
                      <strong>Ubicación:</strong> {selectedPost.ubicacion}
                    </div>
                    <div className="mb-2">
                      <BsTelephone className="me-2" />
                      <strong>Contacto:</strong> {selectedPost.contacto}
                    </div>
                    <div className="mb-2">
                      <BsPerson className="me-2" />
                      <strong>Publicado por:</strong> {selectedPost.usuario.nombre}
                    </div>
                    <div className="mb-4">
                      <BsCalendar className="me-2" />
                      <strong>Fecha:</strong> {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </div>

                    <Button
                      variant="danger"
                      onClick={() => handleDeletePost(selectedPost.id)}
                      className="w-100 rounded-pill"
                    >
                      Eliminar Publicación
                    </Button>
                  </Col>
                </Row>
              </Modal.Body>
            </>
          )}
        </Modal>
      </Container>
    </SSRProvider>
  );
} 