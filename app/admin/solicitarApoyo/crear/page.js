"use client";
import { useState } from "react";
import { Form, Button, Container, Image } from "react-bootstrap";
import SupportRequestController from "@/controllers/SupportRequestController";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SolicitarApoyo() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await SupportRequestController.createRequest({
        ...formData,
        selectedImage
      });

      if (result.ok) {
        toast.success("Solicitud enviada exitosamente");
        router.push("/admin/solicitarApoyo");
      } else {
        toast.error(result.error || "Error al enviar la solicitud");
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      toast.error("Error al procesar la solicitud");
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB
        toast.error("La imagen no debe superar los 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Formato de imagen no válido. Use JPG, PNG o GIF");
        return;
      }

      setSelectedImage(file);
      // Crear URL temporal para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
  };

  return (
    <main className="container py-4" style={{ minHeight: "calc(100vh - 200px)" }}>
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Solicitar Apoyo
      </h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
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

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <div className="d-flex flex-column align-items-center">
                {previewUrl && (
                  <div className="mb-3">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}
                <div>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                    id="image-upload"
                  />
                  <Button
                    variant="primary"
                    onClick={() => document.getElementById("image-upload").click()}
                  >
                    {previewUrl ? "Cambiar imagen" : "Subir imagen"}
                  </Button>
                  {previewUrl && (
                    <Button
                      variant="outline-danger"
                      className="ms-2"
                      onClick={handleRemoveImage}
                    >
                      Eliminar imagen
                    </Button>
                  )}
                </div>
              </div>
              <Form.Text className="text-muted text-center d-block mt-2">
                Tamaño máximo: 5MB. Formatos permitidos: JPG, PNG, GIF
              </Form.Text>
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
