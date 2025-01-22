import SupportRequest from "@/models/SupportRequest";
import { auth } from "@/lib/firebase/config";
import Auth from "@/models/Auth";

class AdminSupportRequestController {
  static async getAllRequests(setRequests) {
    try {
      const unsubscribe = await SupportRequest.getRequests(setRequests);
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching requests:", error);
      return { ok: false, error: error.message };
    }
  }

  static async deleteRequest(requestId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      const userRole = await Auth.getUserRole(user.uid);
      if (userRole !== "Admin") {
        return { ok: false, error: "No tienes permisos para eliminar solicitudes" };
      }

      await SupportRequest.delete(requestId);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting request:", error);
      return { ok: false, error: error.message };
    }
  }

  static async updateRequestStatus(requestId, newStatus) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      const userRole = await Auth.getUserRole(user.uid);
      if (userRole !== "Admin") {
        return { ok: false, error: "No tienes permisos para actualizar solicitudes" };
      }

      await SupportRequest.updateStatus(requestId, newStatus);
      return { ok: true };
    } catch (error) {
      console.error("Error updating request status:", error);
      return { ok: false, error: error.message };
    }
  }
}

export default AdminSupportRequestController; 