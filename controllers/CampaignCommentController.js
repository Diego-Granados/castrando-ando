"use client";
import CampaignComment from "@/models/CampaignComment";
import AuthController from "@/controllers/AuthController";

class CampaignCommentController {
  static async createComment(campaignId, content) {
    try {
      if (!content.trim()) {
        throw new Error("El comentario no puede estar vacío");
      }

      const user = await Auth.getCurrentUser();
      const isAdmin = await this.isUserAdmin();

      let authorName;
      if (isAdmin) {
        // Si es admin, usar el rol como nombre
        authorName = "Administrador";
      } else {
        // Si es usuario normal, obtener sus datos
        const userData = await Auth.getUserData(user.uid);
        if (!userData) {
          throw new Error("Debes iniciar sesión para comentar");
        }
        authorName = userData.name;
      }

      const result = await CampaignComment.createComment(
        campaignId,
        content,
        authorName,
        user.uid
      );

      return { ok: true, commentId: result.commentId };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  static async getComments(campaignId, callback) {
    try {
      // Devolvemos la función de limpieza
      const unsubscribe = await CampaignComment.getComments(
        campaignId,
        callback
      );
      return unsubscribe;
    } catch (error) {
      console.error("Error obteniendo comentarios:", error);
      throw error;
    }
  }

  static async deleteComment(campaignId, commentId) {
    try {
      const user = await Auth.getCurrentUser();
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const isAdmin = await this.isUserAdmin();

      await CampaignComment.deleteComment(
        campaignId,
        commentId,
        user.uid,
        isAdmin
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  static async isUserAuthenticated() {
    try {
      const user = await Auth.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  static async isUserAdmin() {
    try {
      const { role } = await AuthController.getCurrentUser();
      return role === "Admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

export default CampaignCommentController;
