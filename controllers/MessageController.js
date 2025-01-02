import Message from "@/models/Message";
import { auth, db } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";

class MessageController {
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

  static async createMessage(content) {
    try {
      if (!content.trim()) {
        throw new Error("El mensaje no puede estar vacío");
      }

      const currentUser = await this.getCurrentUser();
      
      if (!currentUser) {
        throw new Error("Debes iniciar sesión para enviar mensajes");
      }

      const result = await Message.createMessage(
        content,
        currentUser.name,
        currentUser.uid
      );
      
      return { ok: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error en MessageController:", error);
      return { ok: false, error: error.message };
    }
  }

  static async getMessages(setMessages) {
    try {
      await Message.getMessages(setMessages);
      return { ok: true };
    } catch (error) {
      console.error("Error obteniendo mensajes:", error);
      return { ok: false, error: error.message };
    }
  }

  static async deleteMessage(messageId) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      await Message.deleteMessage(messageId, currentUser.uid);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  static isUserAuthenticated() {
    return auth.currentUser !== null;
  }
}

export default MessageController; 