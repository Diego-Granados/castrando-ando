"use client";
import { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function CrearActividad() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    duracion: "",
    ubicacion: "",
    tipoCapacidad: "ilimitada",
    capacidadTotal: "",
    requisitos: "",
    imagenes: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Actividad creada exitosamente");
    router.push("/admin/actividades");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...imageUrls]
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>Crear Actividad</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duración aproximada</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                    placeholder="ej: 2 horas"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de capacidad</Form.Label>
              <Form.Select
                value={formData.tipoCapacidad}
                onChange={(e) => setFormData({ ...formData, tipoCapacidad: e.target.value })}
                required
              >
                <option value="ilimitada">Ilimitada</option>
                <option value="limitada">Limitada</option>
              </Form.Select>
            </Form.Group>

            {formData.tipoCapacidad === "limitada" && (
              <Form.Group className="mb-3">
                <Form.Label>Capacidad total</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.capacidadTotal}
                  onChange={(e) => setFormData({ ...formData, capacidadTotal: e.target.value })}
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Requisitos</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.requisitos}
                onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                placeholder="Requisitos para participar (opcional)"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Imágenes</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mb-3"
              />
              <div className="image-preview-container">
                {formData.imagenes.map((url, index) => (
                  <div key={index} className="position-relative mb-2">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => router.push("/admin/actividades")}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Crear Actividad
          </Button>
        </div>
      </Form>
    </Container>
  );
} 