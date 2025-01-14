"use client";
import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function CrearReporte() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipoAnimal: "",
    estado: "",
    descripcion: "",
    contact: "",
    location: "",
    images: [],
  });

  const tiposAnimales = [
    "Perro",
    "Gato",
    "Ave",
    "Conejo",
    "Hamster",
    "Otro"
  ];

  const estadosAnimales = [
    "Perdido",
    "Encontrado",
    "En peligro",
    "Herido",
    "Avistado"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Máximo 3 imágenes permitidas");
      return;
    }
    setLoading(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map(file => StorageController.uploadFile(file, "lost-pets/"))
      );
      setFormData(prev => ({
        ...prev,
        images: uploadedUrls
      }));
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      alert("Error al subir las imágenes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      router.push("/animales_perdidos");
    } catch (error) {
      console.error("Error al crear reporte:", error);
      alert("Error al crear el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Reportar Mascota
      </h1>
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
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
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un estado</option>
                {estadosAnimales.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                maxLength={500}
                rows={4}
                placeholder="Describa las características de la mascota (máximo 500 caracteres)"
                required
              />
              <Form.Text className="text-muted">
                {formData.descripcion.length}/500 caracteres
              </Form.Text>
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
                placeholder="Indique dónde se perdió/encontró la mascota"
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