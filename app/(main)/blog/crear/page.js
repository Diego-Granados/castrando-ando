"use client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function CrearBlog() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el blog post
    // Similar a como manejas otros formularios en tu aplicación
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
            <h2>Agregar imagen:</h2>
          </Form.Label>
          <div className="border rounded p-3 text-center">
            {formData.image ? (
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
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  height: "200px",
                  border: "2px dashed #ccc",
                  borderRadius: "4px"
                }}
              >
                <span className="text-muted">+ Seleccionar imagen</span>
              </div>
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => 
                setFormData({ ...formData, image: e.target.files[0] })
              }
              required
            />
          </div>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            variant="primary"
            className="rounded-pill px-4 py-2"
            style={{ fontSize: "1.1rem" }}
          >
            Publicar en blog
          </Button>
        </div>
      </Form>
    </main>
  );
} 