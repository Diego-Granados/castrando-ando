"use client";
import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";
import AuthController from "@/controllers/AuthController";
import LostPetController from "@/controllers/LostPetController";

export default function AdminCrearAnimalPerdido() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    tipoAnimal: "",
    status: "",
    descripcion: "",
    location: "",
    contact: "",
    images: []
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await AuthController.getCurrentUser();
        if (!user || !user.isAdmin) {
          router.push("/login");
          return;
        }
        setCurrentUser(user);
      } catch (error) {
        console.error("Error checking auth:", error);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Debe iniciar sesión como administrador para crear una publicación");
      router.push("/login");
      return;
    }

    try {
      const { success, error } = await LostPetController.createLostPet({
        ...formData,
        userId: currentUser.uid,
        userName: currentUser.displayName || "Administrador"
      });

      if (success) {
        alert("Publicación creada exitosamente");
        router.push("/admin/perdidos");
      } else {
        throw new Error(error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error al crear la publicación");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Solo se permiten hasta 3 imágenes por publicación");
      return;
    }
    setFormData({ ...formData, images: files });
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Crear Publicación de Animal Perdido</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Animal</Form.Label>
              <Form.Select
                required
                value={formData.tipoAnimal}
                onChange={(e) =>
                  setFormData({ ...formData, tipoAnimal: e.target.value })
                }
              >
                <option value="">Seleccionar tipo</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="">Seleccionar estado</option>
                <option value="Perdido">Perdido</option>
                <option value="Encontrado">Encontrado</option>
                <option value="En peligro">En peligro</option>
                <option value="Herido">Herido</option>
                <option value="Avistado">Avistado</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            required
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            placeholder="Describe el animal, características distintivas, circunstancias..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ubicación</Form.Label>
          <Form.Control
            type="text"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="¿Dónde se perdió/encontró?"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contacto</Form.Label>
          <Form.Control
            type="text"
            required
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
            placeholder="Número de teléfono o forma de contacto"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Imágenes (máximo 3)</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Crear Publicación
        </Button>
      </Form>
    </Container>
  );
}
