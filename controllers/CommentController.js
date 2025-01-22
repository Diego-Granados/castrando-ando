"use client";
import Comment from "@/models/Comment";
import AuthController from "@/controllers/AuthController";

class CommentController {
  static async createComment(commentData) {
    try {
      // Si es un comentario de admin (caso especial)
      if (commentData.author === 'Admin' && commentData.authorId === 'admin') {
        const enrichedCommentData = {
          ...commentData,
          authorAvatar: "", // Avatar vacío para admin
          createdAt: new Date().toISOString()
        };

        const result = await Comment.create(enrichedCommentData);
        return { ok: true, comment: result };
      }

      // Para usuarios normales, mantener la validación
      const { user } = await AuthController.getCurrentUser();
      if (!user) {
        return { ok: false, error: "Debes iniciar sesión para comentar" };
      }

      // Obtener datos completos del usuario
      const userData = await AuthController.getUserData(user.uid);
      if (!userData) {
        return { ok: false, error: "No se pudo obtener la información del usuario" };
      }
      
      const enrichedCommentData = {
        ...commentData,
        author: userData.name,
        authorId: user.uid,
        authorAvatar: userData.profileUrl || "",
        createdAt: new Date().toISOString()
      };

      const result = await Comment.create(enrichedCommentData);
      return { ok: true, comment: result };
    } catch (error) {
      console.error("Error en createComment:", error);
      return { ok: false, error: "Error al crear el comentario" };
    }
  }

  static async getComments(entityType, entityId) {
    try {
      const comments = await Comment.getAll(entityType, entityId);
      return { ok: true, comments };
    } catch (error) {
      return { ok: false, error: "Error al cargar los comentarios" };
    }
  }

  static async updateComment(entityType, entityId, commentId, content) {
    try {
      const { user, role } = await AuthController.getCurrentUser();
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      const isAdmin = role === 'Admin';
      
      if (!isAdmin) {
        const comment = await Comment.get(entityType, entityId, commentId);
        if (comment.authorId !== user.uid) {
          return { ok: false, error: "No tienes permiso para editar este comentario" };
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
      // Si es admin, permitir eliminar cualquier comentario
      if (isAdmin) {
        await Comment.delete(entityType, entityId, commentId);
        return { ok: true };
      }

      // Para usuarios normales, verificar propiedad
      const { user } = await AuthController.getCurrentUser();
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      const comment = await Comment.get(entityType, entityId, commentId);
      if (!comment) {
        return { ok: false, error: "Comentario no encontrado" };
      }

      if (comment.authorId !== user.uid) {
        return { ok: false, error: "Solo puedes eliminar tus propios comentarios" };
      }

      await Comment.delete(entityType, entityId, commentId);
      return { ok: true };
    } catch (error) {
      console.error("Error en deleteComment:", error);
      return { ok: false, error: "Error al eliminar el comentario" };
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
    try {
      const currentUser = await AuthController.getCurrentUser();
      if (!currentUser.user) {
        return { user: null };
      }
      
      const userData = await AuthController.getUserData(currentUser.user.uid);
      return {
        user: {
          ...currentUser.user,
          name: userData?.name,
          profileUrl: userData?.profileUrl
        }
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return { user: null };
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

export default CommentController; 