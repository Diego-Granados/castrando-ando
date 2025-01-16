"use client";
import { useState, useEffect } from "react";
import { Form, Button, Container, Image } from "react-bootstrap";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
      let imageUrl = "";
      if (selectedImage) {
        // Crear FormData para subir a Cloudinary
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        // Subir a Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (!data.secure_url) {
          throw new Error('Error al subir la imagen');
        }
        imageUrl = data.secure_url;
      }

      const result = await BlogController.createBlog({
        ...formData,
        imageUrl,
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB
        toast.error("La imagen no debe superar los 5MB");
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
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

  if (loading) {
    return <Container className="py-4">Verificando permisos...</Container>;
  }

  if (!isAdmin) {
    return null;
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
              <Form.Label>Imagen</Form.Label>
              <div className="d-flex flex-column align-items-center">
                {previewUrl && (
                  <div className="mb-3">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                )}
                <div>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <Button
                    variant="primary"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    {previewUrl ? 'Cambiar imagen' : 'Subir imagen'}
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