"use client";
import LostPet from "@/models/LostPet";
import AuthController from "@/controllers/AuthController";
import { NextResponse } from "next/server";

class LostPetController {
  static async getAllLostPets(callback) {
    const unsubscribe = await LostPet.getAll(callback);
    return unsubscribe;
  }

  static async getLostPetById(petId, setPet) {
    const unsubscribe = await LostPet.getById(petId, setPet);
    return unsubscribe;
  }

  static async getLostPetByIdOnce(petId) {
    try {
      const pet = await LostPet.getByIdOnce(petId);
      return pet;
    } catch (error) {
      console.error("Error getting lost pet:", error);
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

  static async createLostPet(formData) {
    try {
      const { user } = await LostPetController.verifyRole();
      
      // Add user information to the formData
      const petData = {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        enabled: true
      };

      await LostPet.create(petData);
      return { success: true, message: "Publicación creada exitosamente" };
    } catch (error) {
      console.error("Error creating lost pet:", error);
      throw new Error(error.message || "Error al crear la publicación");
    }
  }

  static async updateLostPet(petId, formData) {
    try {
      await LostPetController.verifyRole();
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
    }

    try {
      const updates = {};
      updates[`/lostPets/${petId}/tipoAnimal`] = formData.tipoAnimal;
      updates[`/lostPets/${petId}/status`] = formData.status;
      updates[`/lostPets/${petId}/descripcion`] = formData.descripcion;
      updates[`/lostPets/${petId}/location`] = formData.location;
      updates[`/lostPets/${petId}/contact`] = formData.contact;

      await LostPet.update(petId, updates);
      return { success: true, message: "Publicación actualizada exitosamente" };
    } catch (error) {
      console.error("Error updating lost pet:", error);
      throw error;
    }
  }

  static async deleteLostPet(formData) {
    try {
      const { user, role } = await LostPetController.verifyRole();
      const pet = await LostPet.getByIdOnce(formData.petId);
      
      if (pet.userId !== user.uid && role !== "Admin") {
        throw new Error("Unauthorized to delete this lost pet post");
      }

      const petId = formData.petId;
      await LostPet.delete(petId);

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

      return NextResponse.json({ message: "Lost pet post deleted successfully!" });
    } catch (error) {
      return NextResponse.error(error);
    }
  }

  static async updateLostPetStatus(petId, status) {
    try {
      await LostPetController.verifyRole();
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
    }

    try {
      const updates = {};
      updates[`/lostPets/${petId}/status`] = status;

      await LostPet.update(petId, updates);
      return { success: true, message: "Estado actualizado exitosamente" };
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  }
}

export default LostPetController; 