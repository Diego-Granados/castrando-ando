"use client";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PetController from "@/controllers/PetController";

export default function PetForm({ petId, onSuccess, initialData = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(
    initialData?.imageUrl || ""
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB", {
          position: "top-center",
        });
        e.target.value = null;
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, seleccione un archivo de imagen válido", {
          position: "top-center",
        });
        e.target.value = null;
        return;
      }
      setImageFile(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await PetController.deleteImage(petId, currentImageUrl);
      if (response.ok) {
        setCurrentImageUrl("");
        setImageFile(null);
        toast.success("Imagen eliminada con éxito", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        throw new Error("Error al eliminar la imagen");
      }
    } catch (error) {
      toast.error("Error al eliminar la imagen", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = currentImageUrl;

      // Upload new image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("files", imageFile);
        formData.append("path", `pets/${Date.now()}`);

        const uploadResponse = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen");
        }

        const urls = await uploadResponse.json();
        imageUrl = urls[0];
      }

      const formData = new FormData(e.target);
      const petData = {
        name: formData.get("name"),
        animal: formData.get("animal") === "true",
        breed: formData.get("breed"),
        age: parseInt(formData.get("age")),
        sex: formData.get("sex") === "true",
        weight: parseInt(formData.get("weight")),
        imageUrl: imageUrl,
        priceSpecial: formData.get("priceSpecial") === "true",
      };

      if (initialData) {
        await PetController.update(petId, petData, initialData.imageUrl);
        toast.success("Mascota actualizada con éxito", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        await PetController.create(petData);
        toast.success("Mascota agregada con éxito", {
          position: "top-center",
          autoClose: 3000,
        });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || "Error al guardar la mascota", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-4">
        <Form.Label>
          Foto de la mascota {initialData ? "(opcional)" : ""}
        </Form.Label>
        <div className="d-flex align-items-center gap-2 mb-2">
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={currentImageUrl ? "flex-grow-1" : "w-100"}
          />
          {currentImageUrl && (
            <Button
              variant="outline-danger"
              type="button"
              onClick={handleDeleteImage}
            >
              Eliminar foto
            </Button>
          )}
        </div>
        <Form.Text className="text-muted">
          Tamaño máximo: 5MB. Formatos permitidos: JPG, PNG, GIF
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre de la mascota"
          name="name"
          defaultValue={initialData?.name}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="animal">
        <Form.Label>Especie</Form.Label>
        <Form.Select
          name="animal"
          defaultValue={initialData?.animal?.toString() || ""}
          required
        >
          <option value="">Seleccione una especie</option>
          <option value="true">Perro</option>
          <option value="false">Gato</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="breed">
        <Form.Label>Raza</Form.Label>
        <Form.Control
          type="text"
          placeholder="Raza de la mascota"
          name="breed"
          defaultValue={initialData?.breed}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="age">
        <Form.Label>Edad (años)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Edad de la mascota"
          name="age"
          defaultValue={initialData?.age}
          min="0"
          max="30"
          required
        />
      </Form.Group>

      <Form.Group className="mb-4" controlId="sex">
        <Form.Label>Sexo</Form.Label>
        <Form.Select
          name="sex"
          defaultValue={initialData?.sex?.toString() || ""}
          required
        >
          <option value="">Seleccione el sexo</option>
          <option value="true">Macho</option>
          <option value="false">Hembra</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="weight">
        <Form.Label>Peso (kg)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Peso de la mascota"
          name="weight"
          defaultValue={initialData?.weight}
          min="0"
          max="150"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="priceSpecial">
        <Form.Label>
          ¿Tiene una condición especial? (preñez, celo, piometra, perros XL,
          etc...)
        </Form.Label>
        <Form.Select
          name="priceSpecial"
          defaultValue={initialData?.priceSpecial?.toString() || ""}
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </Form.Select>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : initialData
            ? "Actualizar mascota"
            : "Agregar mascota"}
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          onClick={onSuccess}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </Form>
  );
}
