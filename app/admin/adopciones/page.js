"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

export default function AdminAdopciones() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    // Simular carga de datos
    const samplePosts = [
      {
        id: 1,
        titulo: "Cachorro busca hogar",
        descripcion: "Hermoso cachorro de 3 meses en busca de una familia amorosa.",
        tipo: "Perro",
        peso: "4.5 kg",
        ubicacion: "San José",
        contacto: "8888-8888",
        imagenes: ["https://images.unsplash.com/photo-1593134257782-e89567b7718a?w=500"],
        usuario: {
          id: "user1",
          nombre: "María González"
        },
        createdAt: "2024-03-20"
      },
      {
        id: 2,
        titulo: "Gatita rescatada",
        descripcion: "Gatita adulta esterilizada, muy cariñosa.",
        tipo: "Gato",
        peso: "3 kg",
        ubicacion: "Heredia",
        contacto: "7777-7777",
        imagenes: ["https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=500"],
        usuario: {
          id: "user2",
          nombre: "Juan Pérez"
        },
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
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
          Administrar Publicaciones de Adopción
        </h1>
        <p className="text-center">Cargando publicaciones...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Administrar Publicaciones de Adopción
      </h1>

      <Row>
        {posts.map(post => (
          <Col key={post.id} lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={post.imagenes[0]} 
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{post.titulo}</Card.Title>
                <Card.Text>
                  <strong>Tipo:</strong> {post.tipo}<br />
                  <strong>Peso:</strong> {post.peso}<br />
                  <strong>Ubicación:</strong> {post.ubicacion}<br />
                  <strong>Contacto:</strong> {post.contacto}<br />
                  <strong>Publicado por:</strong> {post.usuario.nombre}<br />
                  <strong>Fecha:</strong> {new Date(post.createdAt).toLocaleDateString()}
                </Card.Text>
                <div className="d-grid">
                  <Button
                    variant="danger"
                    onClick={() => handleDeletePost(post.id)}
                    className="rounded-pill"
                  >
                    Eliminar Publicación
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {posts.length === 0 && (
        <p className="text-center">No hay publicaciones de adopción.</p>
      )}
    </Container>
  );
} 