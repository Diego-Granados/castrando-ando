"use client";
import Comment from "@/models/Comment";
import AuthController from "@/controllers/AuthController";
import CampaignController from "@/controllers/CampaignController";
import BlogController from "@/controllers/BlogController";
import LostPetController from "@/controllers/LostPetController";
import UserActivityController from "@/controllers/UserActivityController";
import ActivityController from "@/controllers/ActivityController";
import NotificationController from "@/controllers/NotificationController";

class CommentController {
  static async createComment(commentData) {
    try {
      const { entityType, entityId, content, author, authorId } = commentData;

      if (!entityType || !entityId || !content) {
        return { ok: false, error: "Faltan datos requeridos" };
      }

      let userData;
      let isAdmin = false;
      if (author === "Admin" && authorId === "admin") {
        isAdmin = true;
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

      if (entityType === 'lostPet' && !isAdmin) {
        const pet = await LostPetController.getLostPetByIdOnce(entityId);
        
        if (pet.userId !== userData.authorUid) {
          const ownerRole = await AuthController.getUserRole(pet.userId);
          let ownerCedula;
          let link = `/animales_perdidos`;
          
          if (ownerRole === "Admin") {
            ownerCedula = "admin";
            link = `admin/perdidos`;
          } else {
            ownerCedula = await AuthController.getCedulaByUserId(pet.userId);
            link = `/animales_perdidos`;
          }
          
          await NotificationController.createNotification({
            userId: ownerCedula,
            title: "Nuevo comentario en tu publicación",
            message: `${userData.author} comentó en tu publicación de ${pet.tipoAnimal} perdido del ${new Date(pet.createdAt).toLocaleDateString()}`,
            type: "lost_pet_comment",
            link: link
          });
        }
      }

      // Register user activity only for non-admin users
      if (!isAdmin) {
        let activityType;
        let activityDescription;
        let entityName = '';
        let campaign = null;

        const setCampaign = (data) => {
          campaign = data;
        };
        switch (entityType) {
          case 'campaign':
            await CampaignController.getCampaignByIdOnce(entityId, setCampaign);
            entityName = campaign.title;
            activityType = "CAMPAIGN_COMMENT";
            activityDescription = `Comentó en la campaña "${entityName}"`;
            break;
          case 'blog':
            const blog = await BlogController.getBlogByIdOnce(entityId);
            entityName = blog.title;
            activityType = "BLOG_COMMENT";
            activityDescription = `Comentó en el blog "${entityName}"`;
            break;
          case 'messages':
            entityName = "Foro";
            activityType = "FORUM_POST";
            activityDescription = `Publico un mensaje en el foro`;
            break;
          case 'lostPet':
            const pet = await LostPetController.getLostPetByIdOnce(entityId);
            entityName = pet.tipoAnimal;
            activityType = "LOST_PET_COMMENT";
            activityDescription = `Comentó en la publicación de mascota perdida "${entityName}"`;
            break;
          case 'activity':
            const activity = await ActivityController.getActivityByIdOnce(entityId);
            entityName = activity.title;
            activityType = "ACTIVITY_COMMENT";
            activityDescription = `Comentó en la actividad "${entityName}"`;
            break;
          default:
            break;
        }

        // Only register activity if we have a valid type
        if (activityType) {
          await UserActivityController.registerActivity({
            type: activityType,
            description: activityDescription,
            metadata: {
              entityType,
              entityId,
              entityName,
              commentId: result.id
            }
          });
        }
      }

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
