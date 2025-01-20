"use client";
import Message from "@/models/Message";
import AuthController from "@/controllers/AuthController";

class MessageController {
  static async createMessage(content) {
    try {
      if (!content.trim()) {
        throw new Error("El mensaje no puede estar vacío");
      }

      const { user, role } = await AuthController.getCurrentUser();
      if (!user) {
        throw new Error("Debes iniciar sesión para enviar mensajes");
      }

      let authorName;
      if (role === "Admin") {
        // Si es admin, usar "Administrador" como nombre
        authorName = "Administrador";
      } else {
        // Si es usuario normal, obtener sus datos
        const userData = await AuthController.getUserData(user.uid);
        if (!userData) {
          throw new Error("No se encontraron datos del usuario");
        }
        authorName = userData.name;
      }

      const result = await Message.createMessage(content, authorName, user.uid);

      return { ok: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error en MessageController:", error);
      return { ok: false, error: error.message };
    }
  }

  static async getMessages(setMessages) {
    try {
      // Ahora devolvemos la función de limpieza
      const unsubscribe = await Message.getMessages(setMessages);
      return unsubscribe;
    } catch (error) {
      console.error("Error obteniendo mensajes:", error);
      throw error;
    }
  }

  static async deleteMessage(messageId) {
    try {
      const { user, role } = await AuthController.getCurrentUser();
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      await Message.deleteMessage(messageId, user, role);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  static async isUserAuthenticated() {
    try {
      const { user } = await AuthController.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  static async isUserAdmin() {
    try {
      const { user, role } = await AuthController.getCurrentUser();
      return role === "Admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

export default MessageController;
