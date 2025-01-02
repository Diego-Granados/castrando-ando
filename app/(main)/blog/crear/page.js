"use client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import BlogController from "@/controllers/BlogController";

export default function CrearBlog() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await BlogController.createBlog(
        formData.title,
        formData.content,
        formData.image
      );

      if (result.ok) {
        router.push("/blog");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error al crear blog:", error);
      alert("Error al crear el blog: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Crear Blog
      </h1>

      <Form onSubmit={handleSubmit} className="card shadow-sm p-4">
        <Form.Group className="mb-4">
          <Form.Label>
            <h2>Ingresar título</h2>
          </Form.Label>
          <Form.Control
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>
            <h2>Agregar texto:</h2>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>
            <h2>Agregar imagen (opcional):</h2>
          </Form.Label>
          <div className="border rounded p-3 text-center">
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                style={{
                  maxHeight: "300px",
                  width: "auto",
                  objectFit: "contain"
                }}
                className="mb-3"
              />
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            variant="primary"
            className="rounded-pill px-4 py-2"
            style={{ fontSize: "1.1rem" }}
            disabled={loading}
          >
            {loading ? "Publicando..." : "Publicar en blog"}
          </Button>
        </div>
      </Form>
    </main>
  );
} 