"use client";
import { db } from "@/lib/firebase/config";
import {
  ref,
  get,
  set,
  push,
  remove,
  onValue,
  update,
} from "firebase/database";

class Comment {
  static async create(commentData) {
    try {
      const updates = {};
      const commentsRef = ref(
        db,
        `comments/${commentData.entityType}/${commentData.entityId}`
      );
      const newCommentRef = push(commentsRef);
      const newComment = {
        content: commentData.content,
        author: commentData.author || "Usuario",
        authorId: commentData.authorId,
        authorUid: commentData.authorUid,
        authorAvatar: commentData.authorAvatar || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updates[
        `comments/${commentData.entityType}/${commentData.entityId}/${newCommentRef.key}`
      ] = newComment;
      if (commentData.authorId !== "admin") {
        updates[`users/${commentData.authorId}/comments/${newCommentRef.key}`] =
          {
            entityType: commentData.entityType,
            entityId: commentData.entityId,
          };
      }
      await update(ref(db), updates);
      return { id: newCommentRef.key, ...newComment };
    } catch (error) {
      console.error("Error en create comment:", error);
      throw error;
    }
  }

  static async getAll(entityType, entityId) {
    try {
      const commentsRef = ref(db, `comments/${entityType}/${entityId}`);
      const snapshot = await get(commentsRef);

      if (snapshot.exists()) {
        const comments = [];
        snapshot.forEach((childSnapshot) => {
          comments.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        return comments.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      }
      return [];
    } catch (error) {
      console.error("Error en getAll comments:", error);
      throw error;
    }
  }

  static async get(entityType, entityId, commentId) {
    try {
      const commentRef = ref(
        db,
        `comments/${entityType}/${entityId}/${commentId}`
      );
      const snapshot = await get(commentRef);

      if (!snapshot.exists()) {
        return null;
      }

      return { id: snapshot.key, ...snapshot.val() };
    } catch (error) {
      console.error("Error en get comment:", error);
      throw error;
    }
  }

  static async delete(entityType, entityId, commentId) {
    try {
      // Get comment info first
      const commentRef = ref(
        db,
        `comments/${entityType}/${entityId}/${commentId}`
      );
      const snapshot = await get(commentRef);

      if (!snapshot.exists()) {
        throw new Error("Comment not found");
      }

      const commentData = snapshot.val();

      // Create updates object for atomic operation
      const updates = {};

      // Update enabled status in comments
      updates[`comments/${entityType}/${entityId}/${commentId}`] = null;

      // Update enabled status in user's comments
      updates[`users/${commentData.authorId}/comments/${commentId}`] = null;

      // Apply all updates atomically
      await update(ref(db), updates);
      return true;
    } catch (error) {
      console.error("Error en delete comment:", error);
      throw error;
    }
  }

  static async update(entityType, entityId, commentId, content) {
    try {
      const commentRef = ref(
        db,
        `comments/${entityType}/${entityId}/${commentId}`
      );
      const snapshot = await get(commentRef);

      if (!snapshot.exists()) {
        throw new Error("Comentario no encontrado");
      }

      const commentData = snapshot.val();
      await set(commentRef, {
        ...commentData,
        content,
        updatedAt: new Date().toISOString(),
        isEdited: true,
      });

      return { ok: true };
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  }

  static async toggleLike(entityType, entityId, commentId) {
    try {
      const likeRef = ref(
        db,
        `comments/${entityType}/${entityId}/${commentId}/likes/${commentId}`
      );
      const snapshot = await get(likeRef);

      if (snapshot.exists()) {
        // Si ya dio like, lo quitamos
        await remove(likeRef);
      } else {
        // Si no ha dado like, lo agregamos
        await set(likeRef, true);
      }

      return { ok: true };
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  }

  static async getCommentsByUser(userId) {
    try {
      // Implementar si necesitas obtener todos los comentarios de un usuario
      // Esto requeriría una estructura adicional en la base de datos
      throw new Error("Método no implementado");
    } catch (error) {
      console.error("Error getting user comments:", error);
      throw error;
    }
  }

  static async deleteAllFromEntity(entityType, entityId) {
    try {
      const commentsRef = ref(db, `comments/${entityType}/${entityId}`);
      const snapshot = await get(commentsRef);

      if (snapshot.exists()) {
        const comments = snapshot.val();
        const updates = {};
        Object.entries(comments).forEach(([commentId, comment]) => {
          updates[`comments/${entityType}/${entityId}/${commentId}`] = null;
          if (comment.authorId && comment.authorId !== "admin") {
            updates[`users/${comment.authorId}/comments/${commentId}`] = null;
          }
        });
        await update(ref(db), updates);
      }
      return true;
    } catch (error) {
      console.error("Error deleting all comments:", error);
      throw error;
    }
  }

  static subscribe(entityType, entityId, callback) {
    const commentsRef = ref(db, `comments/${entityType}/${entityId}`);

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const comments = [];
      snapshot.forEach((childSnapshot) => {
        comments.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      // Ordenar por fecha, más antiguos primero
      comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      callback(comments);
    });

    return unsubscribe;
  }
}

export default Comment;
