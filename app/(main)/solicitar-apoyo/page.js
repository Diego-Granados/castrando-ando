"use client";
import { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import SupportRequestController from "@/controllers/SupportRequestController";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function SolicitarApoyo() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Debe iniciar sesión para enviar una solicitud");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const requestData = {
        ...formData,
        userId: auth.currentUser.uid,
        date: new Date().toLocaleDateString(),
        status: "Pendiente",
        petType: "No especificado"
      };

      const result = await SupportRequestController.createRequest(requestData);
      if (result.ok) {
        setSuccess(true);
        setFormData({ title: "", description: "" });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(result.error || "Error al enviar la solicitud");
      }
    } catch (error) {
      setError("Error al procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isAuthenticated) {
    return <Container className="py-4">Redirigiendo al login...</Container>;
  }

  return (
    <main className="container py-4" style={{ minHeight: "calc(100vh - 200px)" }}>
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Solicitar Apoyo
      </h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              ¡Solicitud enviada exitosamente! Redirigiendo...
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <Form.Group className="mb-3">
              <Form.Label>Título de la solicitud</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ingrese un título breve"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describa su situación"
                style={{ resize: "none" }}
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="mb-3"
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
} 