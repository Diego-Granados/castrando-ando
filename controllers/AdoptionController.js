"use client";
import Adoption from "@/models/Adoption";
import AuthController from "@/controllers/AuthController";
import { NextResponse } from "next/server";

class AdoptionController {
  static async getAllAdoptions(setAdoptions) {
    const unsubscribe = await Adoption.getAll(setAdoptions);
    return unsubscribe;
  }

  static async getAdoptionById(adoptionId, setAdoption) {
    const unsubscribe = await Adoption.getById(adoptionId, setAdoption);
    return unsubscribe;
  }

  static async getAdoptionByIdOnce(adoptionId) {
    try {
      const adoption = await Adoption.getByIdOnce(adoptionId);
      return adoption;
    } catch (error) {
      console.error("Error getting adoption:", error);
      throw error;
    }
  }

  static async verifyRole() {
    try {
      const { user, role } = await AuthController.getCurrentUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      return { user, role };
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
    }
  }

  static async createAdoption(formData) {
    try {
      const { user } = await AdoptionController.verifyRole();
      
      // Add user information to the formData
      const adoptionData = {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        enabled: true
      };

      await Adoption.create(adoptionData);
      return { success: true, message: "Publicación creada exitosamente" };
    } catch (error) {
      console.error("Error creating adoption:", error);
      throw new Error(error.message || "Error al crear la publicación");
    }
  }

  static async updateAdoption(formData) {
    try {
      const { user, role } = await AdoptionController.verifyRole();
      const adoption = await Adoption.getByIdOnce(formData.adoptionId);
      
      if (adoption.userId !== user.uid && role !== "Admin") {
        throw new Error("No autorizado para editar esta publicación");
      }

      // Handle new image uploads if any
      let photoUrls = [...(formData.existingPhotos || [])];
      
      if (formData.photos?.length > 0) {
        try {
          const path = `adoptions/adoption-${formData.adoptionId}-${Date.now()}`;
          const fileData = new FormData();
          fileData.append("path", path);

          formData.photos.forEach(file => {
            fileData.append("files", file);
          });

          const uploadResponse = await fetch("/api/storage/upload", {
            method: "POST",
            body: fileData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Error al subir las imágenes");
          }

          const uploadResult = await uploadResponse.json();
          const newUrls = uploadResult.urls || [uploadResult.url];
          photoUrls = [...photoUrls, ...newUrls];
          
        } catch (error) {
          console.error("Error uploading images:", error);
          throw new Error("Error al subir las imágenes");
        }
      }

      const updates = {
        nombre: formData.nombre,
        edad: formData.edad,
        tipoAnimal: formData.tipoAnimal,
        peso: formData.peso,
        descripcion: formData.descripcion,
        contact: formData.contact,
        location: formData.location,
        estado: formData.estado,
        photos: photoUrls
      };

      await Adoption.update(formData.adoptionId, updates);
      return { success: true, message: "Publicación actualizada exitosamente" };
    } catch (error) {
      console.error("Error updating adoption:", error);
      throw error;
    }
  }

  static async deleteAdoption(formData) {
    try {
      const { user, role } = await AdoptionController.verifyRole();
      const adoption = await Adoption.getByIdOnce(formData.adoptionId);
      
      if (adoption.userId !== user.uid && role !== "Admin") {
        throw new Error("Unauthorized to delete this adoption post");
      }

      const adoptionId = formData.adoptionId;
      await Adoption.delete(adoptionId);

      // Delete associated photos
      if (formData.photos?.length > 0) {
        const deleteResponse = await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: formData.photos }),
        });
        
        if (!deleteResponse.ok) {
          throw new Error("Failed to delete photos");
        }
      }

      return NextResponse.json({ message: "Adoption post deleted successfully!" });
    } catch (error) {
      return NextResponse.error(error);
    }
  }

  static async updateAdoptionStatus(adoptionId, estado) {
    try {
      const { user, role } = await AdoptionController.verifyRole();
      const adoption = await Adoption.getByIdOnce(adoptionId);
      
      // Verify if user is owner or admin
      if (adoption.userId !== user.uid && role !== "Admin") {
        throw new Error("Unauthorized to update this adoption status");
      }

      await Adoption.update(adoptionId, { estado });
      return { success: true, message: "Estado actualizado exitosamente" };
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  }
}

export default AdoptionController;
