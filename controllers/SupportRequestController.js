"use client";
import SupportRequest from "@/models/SupportRequest";
import AuthController from "@/controllers/AuthController";
import NotificationController from "@/controllers/NotificationController";

class SupportRequestController {
  static async createRequest(requestData) {
    try {
      // Obtener el usuario y rol actual
      const { user, role } = await AuthController.getCurrentUser();
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      // Subir imagen a Cloudinary si existe
      let imageUrl = "";
      if (requestData.selectedImage) {
        const formData = new FormData();
        formData.append("file", requestData.selectedImage);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (!data.secure_url) {
          throw new Error("Error al subir la imagen");
        }
        imageUrl = data.secure_url;
      }

      // Si es admin, usar datos predeterminados
      if (role === "Admin") {
        const result = await SupportRequest.createRequest({
          title: requestData.title,
          description: requestData.description,
          imageUrl,
          userId: "admin",
          userName: "Administrador",
          status: "Pendiente",
          date: new Date().toLocaleDateString(),
        });
        return { ok: true, id: result.id };
      }

      // Si es usuario normal, obtener sus datos
      const userData = await AuthController.getUserData(user.uid);
      if (!userData) {
        return { ok: false, error: "No se encontraron datos del usuario" };
      }

      const result = await SupportRequest.createRequest({
        title: requestData.title,
        description: requestData.description,
        imageUrl,
        userId: user.uid,
        userName: userData.name || "Usuario",
        status: "Pendiente",
        date: new Date().toLocaleDateString(),
      });

      // Add notification to all users
      await NotificationController.sendNotificationToAllUsers({
        title: "Nueva Solicitud de Ayuda",
        message: `Se ha creado una nueva solicitud de ayuda: "${requestData.title}". ¡Tu apoyo puede hacer la diferencia!`,
        type: "support_request",
        link: `/solicitarApoyo`
      });

      return { ok: true, id: result.id };
    } catch (error) {
      console.error("Error creating request:", error);
      return { ok: false, error: error.message };
    }
  }

  static async getRequests() {
    try {
      const requests = await SupportRequest.getAll();
      return { ok: true, requests };
    } catch (error) {
      console.error("Error getting requests:", error);
      return { ok: false, error: error.message };
    }
  }

  static async updateRequestStatus(requestId, newStatus) {
    try {
      await SupportRequest.updateStatus(requestId, newStatus);
      return { ok: true };
    } catch (error) {
      console.error("Error updating request status:", error);
      return { ok: false, error: error.message };
    }
  }

  static async deleteRequest(requestId) {
    try {
      if (!requestId) {
        throw new Error("ID de solicitud no proporcionado");
      }
      
      const result = await SupportRequest.delete(requestId);
      if (result) {
        return { ok: true };
      } else {
        return { ok: false, error: "No se pudo eliminar la solicitud" };
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      return { ok: false, error: error.message };
    }
  }
}

export default SupportRequestController; 