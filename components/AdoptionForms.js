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
      file,
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
      const formDataObj = new FormData(e.target);
      const submissionData = {
        nombre: formDataObj.get("nombre"),
        edad: formDataObj.get("edad"),
        tipoAnimal: formDataObj.get("tipoAnimal"),
        peso: formDataObj.get("peso"),
        descripcion: formDataObj.get("descripcion"),
        contact: formDataObj.get("contact"),
        location: formDataObj.get("location"),
        estado: "Buscando Hogar"
      };

      // Handle photo uploads first if there are files
      if (selectedFiles.length > 0) {
        try {
          const path = `adoptions/adoption-${Date.now()}`; // Add a timestamp
          const fileData = new FormData();
          fileData.append("path", path);

          // Append each file individually
          for (let i = 0; i < selectedFiles.length; i++) {
            fileData.append("files", selectedFiles[i]);
          }

          const response = await fetch("/api/storage/upload", {
            method: "POST",
            body: fileData,
          });
          const downloadURLs = await response.json();
          submissionData.photos = downloadURLs;
          toast.success("¡Fotos subidas con éxito!");
        } catch (error) {
          console.error("Error uploading images:", error);
          toast.error("Error al subir las imágenes");
          setLoading(false);
          return;
        }
      }

      // If editing, include existing photos that weren't removed
      if (isEditing && initialData?.photos) {
        submissionData.existingPhotos = initialData.photos;
      }

      try {
        const result = await AdoptionController.createAdoption(submissionData);
        console.log(result);
        if (result && result.success) {
          toast.success(result.message || "Operación exitosa");
          router.push('/adopcion');
        } else {
          throw new Error(result?.message || "Error en la operación");
        }
      } catch (error) {
        console.error("Error in submission:", error);
        toast.error(error.message || (isEditing ? 
          'Error al actualizar la publicación' : 
          'Error al crear la publicación'
        ));
      }
    } catch (error) {
      console.error("Error in form handling:", error);
      toast.error(isEditing ? 
        'Error al actualizar la publicación' : 
        'Error al crear la publicación'
      );
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
          <Form onSubmit={handleSubmit}>
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
              <Form.Label>Número de Contacto</Form.Label>
              <Form.Control
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Ejemplo: +506 8888-8888"
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
