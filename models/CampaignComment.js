"use client";
import { db } from "@/lib/firebase/config";
import { ref, push, serverTimestamp, onValue, remove, get } from "firebase/database";

class CampaignComment {
  static async createComment(campaignId, content, author, authorId) {
    try {
      const commentsRef = ref(db, `campaign-comments/${campaignId}`);
      const newComment = {
        content,
        author,
        authorId,
        createdAt: serverTimestamp(),
      };

      const commentRef = await push(commentsRef, newComment);
      return { commentId: commentRef.key };
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  static async getComments(campaignId, callback) {
    try {
      const commentsRef = ref(db, `campaign-comments/${campaignId}`);
      
      // Configurar el listener en tiempo real
      const unsubscribe = onValue(commentsRef, (snapshot) => {
        const comments = [];
        snapshot.forEach((childSnapshot) => {
          const comment = {
            id: childSnapshot.key,
            ...childSnapshot.val(),
            createdAt: new Date(childSnapshot.val().createdAt).toLocaleString(),
          };
          comments.push(comment);
        });
        
        // Ordenar comentarios por fecha (más antiguos primero)
        comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        callback(comments);
      });

      // Devolver la función de limpieza
      return () => unsubscribe();
    } catch (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
  }

  static async deleteComment(campaignId, commentId, userId, isAdmin) {
    try {
      // Verificar si el usuario puede eliminar el comentario
      const commentRef = ref(db, `campaign-comments/${campaignId}/${commentId}`);
      const snapshot = await get(commentRef);
      
      if (!snapshot.exists()) {
        throw new Error("Comentario no encontrado");
      }

      const comment = snapshot.val();
      if (!isAdmin && comment.authorId !== userId) {
        throw new Error("No tienes permiso para eliminar este comentario");
      }

      await remove(commentRef);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
}

export default CampaignComment; 