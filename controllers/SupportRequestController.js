"use client";
import SupportRequest from "@/models/SupportRequest";

class SupportRequestController {
  static async createRequest(requestData) {
    try {
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

      const result = await SupportRequest.createRequest({
        title: requestData.title,
        description: requestData.description,
        imageUrl,
        status: "Pendiente",
        date: new Date().toLocaleDateString(),
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