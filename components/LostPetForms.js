"use client";
import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Badge } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LostPetController from "@/controllers/LostPetController";

export default function StrayForms({ isAdmin = false, initialData = null, onSubmit, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });

  // Initialize formData with null checks
  const [formData, setFormData] = useState({
    tipoAnimal: initialData?.tipoAnimal ?? "",
    status: initialData?.status ?? "",
    descripcion: initialData?.descripcion ?? "",
    location: initialData?.location ?? "",
    contact: initialData?.contact ?? "",
    photos: initialData?.photos ?? []
  });

  // Initialize selectedFiles with proper null check
  const [selectedFiles, setSelectedFiles] = useState(() => {
    if (!initialData?.photos) return [];
    return initialData.photos.map(imageUrl => ({
      file: null,
      preview: imageUrl,
      isExisting: true
    }));
  });

  // Update formData when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        tipoAnimal: initialData.tipoAnimal ?? "",
        status: initialData.status ?? "",
        descripcion: initialData.descripcion ?? "",
        location: initialData.location ?? "",
        contact: initialData.contact ?? "",
        photos: initialData.photos ?? []
      });

      setSelectedFiles(
        initialData.photos?.map(imageUrl => ({
          file: null,
          preview: imageUrl,
          isExisting: true
        })) ?? []
      );
    }
  }, [initialData]);

  const fileInputRef = useRef(null);

  const tiposAnimales = [
    "Perro",
    "Gato",
    "Ave",
    "Otro"
  ];

  const estadosAnimales = [
    "Perdido",
    "Encontrado",
    "En peligro",
    "Herido",
    "Avistado"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const imagePreviewStyle = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '10px'
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 3 - selectedFiles.length;
    
    if (files.length > remainingSlots) {
      toast.error(`Solo puede agregar ${remainingSlots} imagen${remainingSlots !== 1 ? 'es' : ''} más`);
      e.target.value = '';
      return;
    }

    const newFiles = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file),
      isNew: true
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[indexToRemove].isNew) {
        URL.revokeObjectURL(newFiles[indexToRemove].preview);
      }
      newFiles.splice(indexToRemove, 1);
      return newFiles;
    });
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.isNew) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      // Handle image uploads
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        try {
          const path = `lost-pets/pet-${Date.now()}`;
          const fileData = new FormData();
          fileData.append("path", path);
          
          for (let fileObj of selectedFiles) {
            fileData.append("files", fileObj.file);
          }

          const response = await fetch("/api/storage/upload", {
            method: "POST",
            body: fileData,
          });

          if (!response.ok) {
            throw new Error("Error uploading images");
          }

          imageUrls = await response.json();
          toast.success("¡Fotos subidas con éxito!");
        } catch (error) {
          console.error("Error uploading images:", error);
          toast.error("Error al subir las imágenes");
          setLoading(false);
          return;
        }
      }

      // Prepare submission data
      const formDataObj = new FormData(e.target);
      const submissionData = {
        tipoAnimal: formDataObj.get("tipoAnimal"),
        status: formDataObj.get("status"),
        descripcion: formDataObj.get("descripcion"),
        location: formDataObj.get("location"),
        contact: formDataObj.get("contact"),
        photos: imageUrls
      };

      // Submit to backend
      try {
        const result = await LostPetController.createLostPet(submissionData);
        if (result && result.success) {
          toast.success(result.message || "Operación exitosa");
          router.push(isAdmin ? '/admin/animales_perdidos' : '/animales_perdidos');
        } else {
          throw new Error(result?.message || "Error en la operación");
        }
      } catch (error) {
        console.error("Error in submission:", error);
        toast.error(error.message || 'Error al crear la publicación');
      }
    } catch (error) {
      console.error("Error in form handling:", error);
      toast.error('Error al crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLostPet = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const formData = new FormData(e.target);
    const updateData = {
      tipoAnimal: formData.get("tipoAnimal"),
      status: formData.get("status"),
      descripcion: formData.get("descripcion"),
      location: formData.get("location"),
      contact: formData.get("contact"),
      id: initialData.id
    };

    try {
      const result = await LostPetController.updateLostPet(initialData.id, updateData);

      if (result && result.success) {
        toast.success(result.message || "¡Publicación actualizada con éxito!", {
          position: "top-center",
          autoClose: 5000,
          toastId: "update-lost-pet",
          onClose: () => {
            setLoading(false);
            router.push(isAdmin ? '/admin/animales_perdidos' : '/animales_perdidos');
          },
        });
      } else {
        throw new Error(result?.message || "Error al actualizar la publicación");
      }
    } catch (error) {
      console.error("Error updating lost pet:", error);
      toast.error("Error al actualizar la publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={!isEditing ? "py-4" : ""}>
      {isEditing && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            variant="secondary"
            onClick={() => router.push("/animales_perdidos")}
          >
            ← Volver
          </Button>
          {isAdmin && (
            <div className="text-end">
              <Badge bg="primary">Administrador</Badge>
            </div>
          )}
        </div>
      )}
      
      {!isEditing && (
        <div className="mb-4">
          <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
            {isAdmin ? "Crear Nueva Publicación de Animal Perdido" : "Reportar Animal Perdido"}
          </h1>
        </div>
      )}

      <Row className="justify-content-center">
        <Col md={8}>
          {showAlert && (
            <Alert 
              variant={alertInfo.type} 
              onClose={() => setShowAlert(false)} 
              dismissible
              className="mb-3"
            >
              {alertInfo.message}
            </Alert>
          )}

          <Form onSubmit={isEditing ? handleUpdateLostPet : handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Animal</Form.Label>
              <Form.Select
                name="tipoAnimal"
                value={formData.tipoAnimal}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                {tiposAnimales.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un estado</option>
                {estadosAnimales.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe el animal, características distintivas, circunstancias..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="¿Dónde se perdió/encontró?"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Número de teléfono o forma de contacto"
                required
              />
            </Form.Group>

            <Form.Group controlId="photos" className="mb-3">
              <Form.Label>Fotos (máximo 3)</Form.Label>
              {!isEditing ? (
                <>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={selectedFiles.length >= 3}
                  />
                  <Form.Text className="text-muted">
                    Puede subir hasta 3 fotos. {3 - selectedFiles.length} espacios disponibles.
                    <br />
                    Formatos aceptados: JPG, PNG, GIF
                  </Form.Text>
                </>
              ) : (
                <div className="text-muted">
                  Las fotos no se pueden modificar después de crear la publicación.
                </div>
              )}
            </Form.Group>

            {selectedFiles.length > 0 && (
              <div className="mt-3">
                <p>Imágenes seleccionadas:</p>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="position-relative">
                      <img
                        src={file.preview}
                        alt={`Imagen ${index + 1}`}
                        style={imagePreviewStyle}
                      />
                      {!isEditing && (
                        <Button 
                          variant="danger" 
                          size="sm"
                          className="position-absolute top-0 end-0 m-1"
                          onClick={() => handleRemoveFile(index)}
                          style={{ padding: '2px 6px' }}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="rounded-pill"
                style={{ padding: "10px 20px" }}
              >
                {loading ? 
                  (isEditing ? "Actualizando..." : "Publicando...") : 
                  (isEditing ? "Guardar Cambios" : "Publicar")
                }
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
