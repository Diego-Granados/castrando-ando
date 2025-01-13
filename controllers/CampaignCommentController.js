import CampaignComment from "@/models/CampaignComment";
import { auth, db } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";

class CampaignCommentController {
  static async getCurrentUser() {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error("No hay usuario autenticado");
      }

      const cedulaRef = ref(db, `uidToCedula/${firebaseUser.uid}`);
      const cedulaSnapshot = await get(cedulaRef);
      const cedula = cedulaSnapshot.val();

      const userRef = ref(db, `users/${cedula}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData) {
        throw new Error("No se encontraron datos del usuario");
      }

      return {
        ...userData,
        uid: firebaseUser.uid
      };
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
      throw error;
    }
  }

  static async createComment(campaignId, content) {
    try {
      if (!content.trim()) {
        throw new Error("El comentario no puede estar vacío");
      }

      const currentUser = await this.getCurrentUser();
      
      if (!currentUser) {
        throw new Error("Debes iniciar sesión para comentar");
      }

      const result = await CampaignComment.createComment(
        campaignId,
        content,
        currentUser.name,
        currentUser.uid
      );
      
      return { ok: true, commentId: result.commentId };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  static async getComments(campaignId, setComments) {
    try {
      await CampaignComment.getComments(campaignId, setComments);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  static async deleteComment(campaignId, commentId) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      await CampaignComment.deleteComment(campaignId, commentId, currentUser.uid);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  static isUserAuthenticated() {
    return auth.currentUser !== null;
  }
}

export default CampaignCommentController; 