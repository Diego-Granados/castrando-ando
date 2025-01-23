"use client";
import Comment from "@/models/Comment";
import AuthController from "@/controllers/AuthController";

class CommentController {
  static async createComment(commentData) {
    try {
      const { entityType, entityId, content, author, authorId } = commentData;

      if (!entityType || !entityId || !content) {
        return { ok: false, error: "Faltan datos requeridos" };
      }

      let userData;
      if (author === "Admin" && authorId === "admin") {
        userData = {
          author: "Admin",
          authorId: "admin",
          authorUid: "admin",
          authorAvatar: "",
        };
      } else {
        const { user } = await AuthController.getCurrentUser();
        if (!user) {
          return { ok: false, error: "Debes iniciar sesión para comentar" };
        }
        const userDataFromDB = await AuthController.getUserData(user.uid);
        userData = {
          author: userDataFromDB.name,
          authorId: userDataFromDB.id,
          authorUid: user.uid,
          authorAvatar: userDataFromDB.profileUrl || "",
        };
      }

      const result = await Comment.create({
        ...commentData,
        ...userData,
      });

      return { ok: true, comment: result };
    } catch (error) {
      console.error("Error creating comment:", error);
      return { ok: false, error: error.message };
    }
  }

  static async getComments(entityType, entityId, setComments) {
    try {
      // Primero obtener los comentarios existentes
      const comments = await Comment.getAll(entityType, entityId);
      setComments(comments);

      // Luego suscribirse a cambios
      const unsubscribe = Comment.subscribe(entityType, entityId, setComments);
      return unsubscribe;
    } catch (error) {
      console.error("Error obteniendo comentarios:", error);
      throw error;
    }
  }

  static async updateComment(entityType, entityId, commentId, content) {
    try {
      const { user, role } = await AuthController.getCurrentUser();
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      const isAdmin = role === "Admin";

      if (!isAdmin) {
        const comment = await Comment.get(entityType, entityId, commentId);
        if (comment.authorId !== user.uid) {
          return {
            ok: false,
            error: "No tienes permiso para editar este comentario",
          };
        }
      }

      await Comment.update(entityType, entityId, commentId, content);
      return { ok: true };
    } catch (error) {
      console.error("Error updating comment:", error);
      return { ok: false, error: error.message };
    }
  }

  static async deleteComment(entityType, entityId, commentId, isAdmin = false) {
    try {
      if (!isAdmin) {
        const { user } = await AuthController.getCurrentUser();
        if (!user) {
          return { ok: false, error: "Usuario no autenticado" };
        }

        const comment = await Comment.get(entityType, entityId, commentId);
        if (!comment || comment.authorUid !== user.uid) {
          return {
            ok: false,
            error: "No tienes permiso para eliminar este comentario",
          };
        }
      }

      await Comment.delete(entityType, entityId, commentId);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting comment:", error);
      return { ok: false, error: error.message };
    }
  }

  static async toggleLike(entityType, entityId, commentId) {
    try {
      const { user } = await AuthController.getCurrentUser();
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      await Comment.toggleLike(entityType, entityId, commentId);
      return { ok: true };
    } catch (error) {
      console.error("Error toggling like:", error);
      return { ok: false, error: error.message };
    }
  }

  // Métodos de verificación
  static async isUserAuthenticated() {
    const { user } = await AuthController.getCurrentUser();
    return user !== null;
  }

  static async getCurrentUser() {
    return AuthController.getCurrentUser();
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

export default CommentController;
