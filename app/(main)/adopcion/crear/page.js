"use client";
import { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function CrearAdopcion() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    tipoAnimal: "",
    peso: "",
    descripcion: "",
    contact: "",
    location: "",
    images: []
  });

  const tiposAnimales = [
    "Perro",
    "Gato",
    "Ave",
    "Conejo",
    "Hamster",
    "Otro"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    setFormData(prev => ({
      ...prev,
      images: mockImageUrls
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Datos del formulario:", {
        ...formData,
        date: new Date().toLocaleDateString()
      });
      
      alert("Publicación creada exitosamente");
      router.push("/adopcion");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Publicar en Adopción
      </h1>
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Mascota</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre de la mascota"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Animal</Form.Label>
              <Form.Select
                name="tipoAnimal"
                value={formData.tipoAnimal}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                {tiposAnimales.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Peso</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleInputChange}
                  placeholder="Ingrese el peso"
                  min="0"
                  step="0.1"
                  required
                />
                <InputGroup.Text>kg</InputGroup.Text>
              </InputGroup>
              <Form.Text className="text-muted">
                Ingrese el peso aproximado en kilogramos
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describa la mascota, su personalidad, estado de salud, requisitos de adopción, etc."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de Contacto</Form.Label>
              <Form.Control
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Ejemplo: +506 8888-8888"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="¿Dónde se encuentra la mascota?"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imágenes (máximo 3)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
              />
              <Form.Text className="text-muted">
                Puede subir hasta 3 imágenes
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="rounded-pill"
                style={{ padding: "10px 20px" }}
              >
                {loading ? "Publicando..." : "Publicar"}
              </Button>

            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
} 