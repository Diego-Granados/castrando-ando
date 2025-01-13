"use client";
import { useState } from "react";
import { Form, Button, Image, Row, Col } from "react-bootstrap";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import BlogController from "@/controllers/BlogController";

export default function CreateBlog() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = async (result) => {
    try {
      if (result.event !== "success") return;

      const newImageUrl = result.info.secure_url;
      setImageUrl(newImageUrl);

      toast.success("¡Imagen subida con éxito!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error al subir la imagen", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleImageRemoval = () => {
    setImageUrl("");
    toast.success("Imagen eliminada", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const blogData = {
        title: formData.get("title"),
        content: formData.get("content"),
        imageUrl: imageUrl,
      };

      const result = await BlogController.createBlog(blogData);
      if (result.ok) {
        toast.success("¡Blog creado con éxito!", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/blog");
      } else {
        toast.error(result.error, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Crear Nuevo Blog</h1>
      <Form onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Imagen del blog"
              style={{ maxWidth: "300px", height: "auto" }}
              className="mb-3"
            />
          )}
          
          <Row>
            <Col className={`${imageUrl ? "text-end pe-5" : "text-center"}`}>
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUpload}
                options={{
                  maxFiles: 1,
                  resourceType: "image",
                  maxFileSize: 5000000, // 5MB
                  sources: ["local"],
                  styles: {
                    palette: {
                      window: "#FFFFFF",
                      windowBorder: "#90A0B3",
                      tabIcon: "#0078FF",
                      menuIcons: "#5A616A",
                      textDark: "#000000",
                      textLight: "#FFFFFF",
                      link: "#0078FF",
                      action: "#FF620C",
                      inactiveTabIcon: "#0E2F5A",
                      error: "#F44235",
                      inProgress: "#0078FF",
                      complete: "#20B832",
                      sourceBg: "#E4EBF1",
                    },
                  },
                }}
                className="btn btn-primary"
              >
                {imageUrl ? "Cambiar imagen" : "Subir imagen"}
              </CldUploadButton>
            </Col>
            {imageUrl && (
              <Col className="text-start ps-5">
                <Button
                  variant="outline-danger"
                  type="button"
                  onClick={handleImageRemoval}
                >
                  Eliminar imagen
                </Button>
              </Col>
            )}
          </Row>

          <Form.Text className="text-muted d-block mt-2">
            Tamaño máximo: 5MB. Formatos permitidos: JPG, PNG, GIF
          </Form.Text>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="title"
            required
            placeholder="Ingrese el título del blog"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contenido</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            required
            rows={5}
            placeholder="Escriba el contenido del blog"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando..." : "Crear Blog"}
        </Button>
      </Form>
    </div>
  );
} 