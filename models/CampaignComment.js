import { auth, db } from "@/lib/firebase/config";
import { ref, set, get, remove, query, orderByChild } from "firebase/database";

class CampaignComment {
  static async createComment(campaignId, content, author, authorId) {
    try {
      const commentId = Date.now().toString();
      const commentRef = ref(db, `campaignComments/${campaignId}/${commentId}`);
      const commentData = {
        content,
        author,
        authorId,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toLocaleString()
      };

      await set(commentRef, commentData);
      return { ok: true, commentId };
    } catch (error) {
      console.error("Error en CampaignComment model:", error);
      throw error;
    }
  }

  static async getComments(campaignId, setComments) {
    try {
      const commentsRef = ref(db, `campaignComments/${campaignId}`);
      const snapshot = await get(commentsRef);
      if (snapshot.exists()) {
        const commentsData = snapshot.val();
        const commentsArray = Object.entries(commentsData).map(([id, comment]) => ({
          id,
          ...comment
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setComments(commentsArray);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error obteniendo comentarios:", error);
      throw error;
    }
  }

  static async deleteComment(campaignId, commentId, userId, isAdmin) {
    try {
      const commentRef = ref(db, `campaignComments/${campaignId}/${commentId}`);
      
      // Si es admin, permitir borrar directamente
      if (isAdmin) {
        await remove(commentRef);
        return;
      }
      
      // Si no es admin, verificar que sea el autor
      const snapshot = await get(commentRef);
      if (!snapshot.exists()) {
        throw new Error("Comentario no encontrado");
      }

      const comment = snapshot.val();
      if (comment.authorId !== userId) {
        throw new Error("No tienes permiso para eliminar este comentario");
      }

      await remove(commentRef);
    } catch (error) {
      throw error;
    }
  }
}

export default CampaignComment; 