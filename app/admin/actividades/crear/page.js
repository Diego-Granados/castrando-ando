"use client";
import { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ActivityController from "@/controllers/ActivityController";
import { toast } from "react-toastify";
export default function CrearActividad() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    hour: "",
    duration: "",
    location: "",
    capacityType: "ilimitada",
    totalCapacity: "",
    requirements: "",
    images: [],
  });
  const [imageUrls, setImageUrls] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await ActivityController.createActivity(formData);
    if (result.ok) {
      toast.success("¡Actividad creada exitosamente!", {
        onClose: () => {
          router.push("/admin/actividades");
        },
      });
    } else {
      toast.error(result.error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrlsList = files.map((file) => URL.createObjectURL(file));
    setImageUrls(imageUrlsList);
    setFormData((prev) => ({
      ...prev,
      images: [...files],
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Crear Actividad
      </h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.hour}
                    onChange={(e) =>
                      setFormData({ ...formData, hour: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duración aproximada</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
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
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de capacidad</Form.Label>
              <Form.Select
                value={formData.capacityType}
                onChange={(e) =>
                  setFormData({ ...formData, capacityType: e.target.value })
                }
                required
              >
                <option value="ilimitada">Ilimitada</option>
                <option value="limitada">Limitada</option>
              </Form.Select>
            </Form.Group>

            {formData.capacityType === "limitada" && (
              <Form.Group className="mb-3">
                <Form.Label>Capacidad total</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.totalCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, totalCapacity: e.target.value })
                  }
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Requisitos</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
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
                {imageUrls.map((url, index) => (
                  <div key={index} className="position-relative mb-2">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/actividades")}
          >
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
