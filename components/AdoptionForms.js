"use client";
import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Alert, Badge, Card } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AdoptionController from "@/controllers/AdoptionController";

export default function AdoptionForms({ isAdmin = false, initialData = null, onSubmit, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });
  
  // Add null checks when initializing formData
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre ?? "",
    edad: initialData?.edad ?? "",
    tipoAnimal: initialData?.tipoAnimal ?? "",
    peso: initialData?.peso ?? "",
    descripcion: initialData?.descripcion ?? "",
    contact: initialData?.contact ?? "",
    location: initialData?.location ?? "",
    estado: initialData?.estado ?? "Buscando Hogar",
    photos: initialData?.photos ?? []
  });

  // Initialize selectedFiles with proper null check
  const [selectedFiles, setSelectedFiles] = useState(() => {
    if (!initialData?.photos) return [];
    return initialData.photos.map(photoUrl => ({
      file: null,
      preview: photoUrl,
      isExisting: true
    }));
  });

  // Add useEffect to update formData when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      setFormData({
        nombre: initialData.nombre ?? "",
        edad: initialData.edad ?? "",
        tipoAnimal: initialData.tipoAnimal ?? "",
        peso: initialData.peso ?? "",
        descripcion: initialData.descripcion ?? "",
        contact: initialData.contact ?? "",
        location: initialData.location ?? "",
        estado: initialData.estado ?? "Buscando Hogar",
        photos: initialData.photos ?? []
      });

      setSelectedFiles(
        initialData.photos?.map(photoUrl => ({
          file: null,
          preview: photoUrl,
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
    "Conejo",
    "Hamster",
    "Otro"
  ];

  const estadosAdopcion = [
    "Buscando Hogar",
    "En proceso",
    "Adoptado"
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
      e.target.value = ''; // Clear the file input
      return;
    }

    // Create preview URLs for new files
    const newFiles = files.map(file => ({
      file: file,  // Store the actual File object
      preview: URL.createObjectURL(file),
      isNew: true
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      // Revoke the object URL if it's a new file
      if (newFiles[indexToRemove].isNew) {
        URL.revokeObjectURL(newFiles[indexToRemove].preview);
      }
      newFiles.splice(indexToRemove, 1);
      return newFiles;
    });
  };

  // Clean up object URLs when component unmounts
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
      // Handle photo uploads if there are files
      let photoUrls = [];
      if (selectedFiles.length > 0) {
        try {
          const path = `adoptions/adoption-${Date.now()}`;
          const fileData = new FormData();
          fileData.append("path", path);
          
          // Append all files - treating them all as new
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

          photoUrls = await response.json();
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
        nombre: formDataObj.get("nombre"),
        edad: formDataObj.get("edad"),
        tipoAnimal: formDataObj.get("tipoAnimal"),
        peso: formDataObj.get("peso"),
        descripcion: formDataObj.get("descripcion"),
        contact: formDataObj.get("contact"),
        location: formDataObj.get("location"),
        estado: "Buscando Hogar",
        photos: photoUrls
      };

      // Submit to backend
      try {
        const result = await AdoptionController.createAdoption(submissionData);
        if (result && result.success) {
          toast.success(result.message || "Operación exitosa");
          router.push(isAdmin ? '/admin/adopcion' : '/adopcion');
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

  const handleUpdateAdoption = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const formData = new FormData(e.target);
    
    // Get existing photos that weren't deleted
    const remainingPhotos = selectedFiles
      .filter(file => !file.isNew)
      .map(file => file.preview);

    // Get new files that need to be uploaded
    const newFiles = selectedFiles
      .filter(file => file.isNew)
      .map(file => file.file);

    const updateData = {
      nombre: formData.get("nombre"),
      edad: formData.get("edad"),
      tipoAnimal: formData.get("tipoAnimal"),
      peso: formData.get("peso"),
      descripcion: formData.get("descripcion"),
      contact: formData.get("contact"),
      location: formData.get("location"),
      estado: formData.get("estado"),
      photos: remainingPhotos,
      newFiles: newFiles
    };

    try {
      const result = await AdoptionController.updateAdoption(initialData.id, updateData);

      if (result && result.success) {
        toast.success(result.message || "¡Publicación actualizada con éxito!", {
          position: "top-center",
          autoClose: 5000,
          toastId: "update-adoption",
          onClose: () => {
            setLoading(false);
            router.push(isAdmin ? '/admin/adopcion' : '/adopcion');
          },
        });
      } else {
        throw new Error(result?.message || "Error al actualizar la publicación");
      }
    } catch (error) {
      console.error("Error updating adoption:", error);
      toast.error("Error al actualizar la publicación", {
        position: "top-center",
        autoClose: 8000,
        toastId: "update-adoption",
      });
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
            onClick={() => router.push("/adopcion")}
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
            {isAdmin ? "Crear Nueva Publicación de Adopción" : "Publicar en Adopción"}
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
          <Form onSubmit={isEditing ? handleUpdateAdoption : handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Mascota</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre de la mascota"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Edad (años)</Form.Label>
              <Form.Control
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                placeholder="Ingrese la edad aproximada"
                min="0"
                step="1"
              />
              <Form.Text className="text-muted">
                Campo opcional - Ingrese la edad aproximada en años
              </Form.Text>
            </Form.Group>

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
              <Form.Label>Peso</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleInputChange}
                  placeholder="Ingrese el peso"
                  min="0"
                  step="0.1"
                  required
                />
                <InputGroup.Text>kg</InputGroup.Text>
              </InputGroup>
              <Form.Text className="text-muted">
                Ingrese el peso aproximado en kilogramos
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describa la mascota, su personalidad, estado de salud, requisitos de adopción, etc."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                name="contact" 
                value={formData.contact}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData(prev => ({
                    ...prev,
                    contact: value
                  }));
                }}
                placeholder="Número de teléfono"
                inputMode="numeric"
                pattern="[0-9]*"
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
                placeholder="¿Dónde se encuentra la mascota?"
                required
              />
            </Form.Group>

            <Form.Group controlId="photos" className="mb-3">
              <Form.Label>Fotos (máximo 3)</Form.Label>
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
            </Form.Group>

            {selectedFiles.length > 0 && (
              <div className="mt-3">
                <p>Imágenes seleccionadas:</p>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="position-relative">
                      <img
                        src={file.preview}
                        alt={file.name || `Imagen ${index + 1}`}
                        style={imagePreviewStyle}
                      />
                        <Button 
                          variant="danger" 
                          size="sm"
                          className="position-absolute top-0 end-0 m-1"
                          onClick={() => handleRemoveFile(index)}
                          style={{ padding: '2px 6px' }}
                        >
                          ×
                        </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="alert alert-danger mb-3" role="alert">
              <Form.Check
                type="checkbox"
                id="castratedCheck"
                label={<strong>Confirmo que el animal está castrado</strong>}
                required
                style={{ 
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              />
            </div>

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
