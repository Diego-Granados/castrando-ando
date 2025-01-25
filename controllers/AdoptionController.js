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

  static async updateAdoption(adoptionId, formData) {
    try {
      await AdoptionController.verifyRole();
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
    }

    try {
      // Get existing adoption data to compare photos
      const existingAdoption = await Adoption.getByIdOnce(adoptionId);
      if (!existingAdoption) {
        throw new Error("Adoption not found");
      }

      let finalPhotos = [];

      // Handle existing photos deletion
      if (existingAdoption.photos.length > 0) {
        const photosToDelete = existingAdoption.photos.filter(
          oldPhoto => !formData.photos.includes(oldPhoto)
        );

        if (photosToDelete.length > 0) {
          console.log("Deleting photos:", photosToDelete);
          const deleteResponse = await fetch("/api/storage/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ urls: photosToDelete }),
          });
          
          if (!deleteResponse.ok) {
            throw new Error("Failed to delete old photos");
          }
        }

        // Keep existing photos that weren't deleted
        finalPhotos = existingAdoption.photos.filter(
          photo => !photosToDelete.includes(photo)
        );
      }

      // Handle new photo uploads if there are files
      if (formData.newFiles && formData.newFiles.length > 0) {
        try {
          const path = `adoptions/adoption-${Date.now()}`;
          const fileData = new FormData();
          fileData.append("path", path);
          
          for (let file of formData.newFiles) {
            fileData.append("files", file);
          }

          const uploadResponse = await fetch("/api/storage/upload", {
            method: "POST",
            body: fileData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Error uploading images");
          }

          const newPhotoUrls = await uploadResponse.json();
          finalPhotos = [...finalPhotos, ...newPhotoUrls];
        } catch (error) {
          console.error("Error uploading new images:", error);
          throw new Error("Failed to upload new images");
        }
      }

      // Update the database with new data
      const updates = {};
      updates[`/adoptions/${adoptionId}/nombre`] = formData.nombre;
      updates[`/adoptions/${adoptionId}/edad`] = formData.edad;
      updates[`/adoptions/${adoptionId}/tipoAnimal`] = formData.tipoAnimal;
      updates[`/adoptions/${adoptionId}/peso`] = formData.peso;
      updates[`/adoptions/${adoptionId}/descripcion`] = formData.descripcion;
      updates[`/adoptions/${adoptionId}/contact`] = formData.contact;
      updates[`/adoptions/${adoptionId}/location`] = formData.location;
      updates[`/adoptions/${adoptionId}/estado`] = formData.estado;
      updates[`/adoptions/${adoptionId}/photos`] = finalPhotos;

      await Adoption.update(adoptionId, updates);

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
        await AdoptionController.verifyRole();
      } catch (error) {
        return NextResponse.error("User not authenticated", { status: 401 });
      }
    try {
        const updates = {};
        updates[`/adoptions/${adoptionId}/estado`] = estado;
  
        await Adoption.update(adoptionId, updates);
        return { success: true, message: "Estado actualizado exitosamente" };
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
  }
}

export default AdoptionController;
