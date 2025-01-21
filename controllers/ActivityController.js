"use client";
import Activity from "@/models/Activity";
import {
  sendActivityRegistrationEmail,
  sendActivityDeregistrationEmail,
} from "@/controllers/EmailSenderController";

class ActivityController {
  static async createActivity(activityData) {
    console.log(activityData);
    try {
      // Basic validation
      if (
        !activityData.title ||
        !activityData.description ||
        !activityData.date ||
        !activityData.hour ||
        !activityData.duration ||
        !activityData.location
      ) {
        throw new Error("Todos los campos son obligatorios.");
      }

      // Validate date is not in the past
      const activityDate = new Date(activityData.date);
      if (activityDate < new Date()) {
        throw new Error("La fecha no puede ser en el pasado.");
      }

      // Upload images if present
      let imageUrls = [];
      if (activityData.images && activityData.images.length > 0) {
        const formData = new FormData();
        formData.append("path", `activities/${Date.now()}`);
        activityData.images.forEach((file) => {
          formData.append("files", file);
        });

        const uploadResponse = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir las imágenes");
        }

        imageUrls = await uploadResponse.json();
      }

      if (activityData.capacityType === "limitada") {
        if (activityData.totalCapacity <= 0) {
          throw new Error("El número de cupos no puede ser menor o igual a 0");
        }
        activityData.available = activityData.totalCapacity;
      }

      // Create activity with image URLs
      const { id } = await Activity.create({
        ...activityData,
        images: imageUrls,
      });

      return { ok: true, id };
    } catch (error) {
      return {
        ok: false,
        error: error.message || "Error al crear la actividad.",
      };
    }
  }

  static async getAll(setActivities) {
    try {
      const unsubscribe = await Activity.getAll(setActivities);
      return unsubscribe;
    } catch (error) {
      console.error("Error getting activities:", error);
      throw error;
    }
  }

  static async getActivityById(id, setActivity) {
    try {
      const unsubscribe = await Activity.getById(id, setActivity);
      return unsubscribe;
    } catch (error) {
      console.error("Error getting activity:", error);
      throw error;
    }
  }

  static async getAllActivitiesOnce() {
    try {
      const activities = await Activity.getAllOnce();
      return activities;
    } catch (error) {
      console.error("Error getting activities:", error);
      throw error;
    }
  }

  static async getActivityByIdOnce(id) {
    try {
      const activity = await Activity.getByIdOnce(id);
      return activity;
    } catch (error) {
      console.error("Error getting activity:", error);
      throw error;
    }
  }

  static async updateActivity(id, activityData) {
    try {
      // Basic validation
      if (
        !activityData.title ||
        !activityData.description ||
        !activityData.date ||
        !activityData.hour ||
        !activityData.duration ||
        !activityData.location
      ) {
        throw new Error("Todos los campos son obligatorios");
      }
      console.log(activityData);
      // Validate date is not in the past
      const activityDate = new Date(activityData.date);
      if (activityDate < new Date()) {
        throw new Error("La fecha no puede ser en el pasado");
      }

      let imageUrls = activityData.images;

      // Delete old images if requested
      if (
        activityData.imagesToDelete &&
        activityData.imagesToDelete.length > 0
      ) {
        await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: activityData.imagesToDelete }),
        });

        // Remove deleted images from the URLs array
        imageUrls = imageUrls.filter(
          (url) => !activityData.imagesToDelete.includes(url)
        );
      }

      // Upload new images if present
      if (activityData.newImages && activityData.newImages.length > 0) {
        const formData = new FormData();
        formData.append("path", `activities/${Date.now()}`);
        activityData.newImages.forEach((file) => {
          formData.append("files", file);
        });

        const uploadResponse = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir las imágenes nuevas");
        }

        const newImageUrls = await uploadResponse.json();
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      if (activityData.capacityType === "limitada") {
        if (activityData.totalCapacity <= 0) {
          throw new Error("El número de cupos no puede ser menor o igual a 0");
        }
      }
      delete activityData.imagesToDelete;
      delete activityData.newImages;
      console.log(activityData);
      // Update activity with final image URLs
      const success = await Activity.update(id, {
        ...activityData,
        images: imageUrls,
      });

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error.message || "Error al actualizar la actividad",
      };
    }
  }

  static async deleteActivity(activity) {
    try {
      console.log(activity);
      // Delete images if they exist
      if (activity.images && activity.images.length > 0) {
        const deleteResponse = await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: activity.images }),
        });

        if (!deleteResponse.ok) {
          throw new Error("Error al eliminar las imágenes");
        }
      }

      const success = await Activity.delete(activity.id);
      if (!success) {
        throw new Error("Error al eliminar la actividad");
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error.message || "Error al eliminar la actividad",
      };
    }
  }

  static async registerUser(activity, user, limited) {
    try {
      const success = await Activity.registerUser(activity.id, user, limited);
      const emailResponse = await sendActivityRegistrationEmail(
        user.email,
        user.name,
        activity
      );
      return { ok: true, emailResponse };
    } catch (error) {
      return {
        ok: false,
        error: error.message || "Error al registrar el usuario",
      };
    }
  }

  static async deregisterUser(activity, user, limited) {
    try {
      const success = await Activity.deregisterUser(activity.id, user, limited);
      const emailResponse = await sendActivityDeregistrationEmail(
        user.email,
        user.name,
        activity
      );
      return { ok: true, emailResponse };
    } catch (error) {
      return {
        ok: false,
        error: error.message || "Error al cancelar la inscripción",
      };
    }
  }
}

export default ActivityController;
