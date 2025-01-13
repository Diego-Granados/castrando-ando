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

  static async deleteComment(campaignId, commentId, userId) {
    try {
      const commentRef = ref(db, `campaignComments/${campaignId}/${commentId}`);
      const snapshot = await get(commentRef);
      
      if (snapshot.exists()) {
        const commentData = snapshot.val();
        if (commentData.authorId === userId) {
          await remove(commentRef);
          return { ok: true };
        } else {
          throw new Error("No tienes permiso para eliminar este comentario");
        }
      }
      throw new Error("Comentario no encontrado");
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      throw error;
    }
  }
}

export default CampaignComment; 