"use client";
import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import BlogController from "@/controllers/BlogController";
import { toast } from "react-toastify";

export default function CrearBlog() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const adminStatus = await BlogController.isUserAdmin();
        if (!adminStatus) {
          router.push("/blog");
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error("Error verificando admin:", error);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("No tienes permisos para crear blogs");
      return;
    }

    try {
      const result = await BlogController.createBlog({
        ...formData,
        date: new Date().toLocaleDateString(),
      });

      if (result.ok) {
        toast.success("Blog creado exitosamente");
        router.push("/blog");
      } else {
        toast.error(result.error || "Error al crear el blog");
      }
    } catch (error) {
      console.error("Error al crear blog:", error);
      toast.error("Error al crear el blog");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <Container className="py-4">Verificando permisos...</Container>;
  }

  if (!isAdmin) {
    return null; // No renderizar nada mientras redirige
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>Crear Blog</h1>
      <div className="card shadow-sm">
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ingrese el título del blog"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Ingrese la URL de la imagen (opcional)"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                placeholder="Escriba el contenido del blog"
                style={{ resize: "vertical" }}
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" size="lg">
                Publicar Blog
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
} 