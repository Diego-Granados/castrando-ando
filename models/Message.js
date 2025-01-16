import { auth, db } from "@/lib/firebase/config";
import { ref, set, get, remove, query, orderByChild, onValue } from "firebase/database";

class Message {
  static async createMessage(content, author, authorId) {
    try {
      // Generar un ID único para el mensaje
      const messageId = Date.now().toString();
      
      // Crear entrada en la base de datos
      const messageRef = ref(db, `messages/${messageId}`);
      const messageData = {
        content,
        author,
        authorId,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toLocaleString()
      };

      await set(messageRef, messageData);
      return { ok: true, messageId };
    } catch (error) {
      console.error("Error en Message model:", error);
      throw error;
    }
  }

  static async getMessages(callback) {
    try {
      const messagesRef = ref(db, 'messages');
      // Usar onValue para escuchar cambios en tiempo real
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = snapshot.val();
          const messagesArray = Object.entries(messagesData).map(([id, message]) => ({
            id,
            ...message
          })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          callback(messagesArray);
        } else {
          callback([]);
        }
      });

      // Devolver la función de limpieza
      return unsubscribe;
    } catch (error) {
      console.error("Error obteniendo mensajes:", error);
      throw error;
    }
  }

  static async deleteMessage(messageId, userId, role) {
    try {
      const messageRef = ref(db, `messages/${messageId}`);
      const snapshot = await get(messageRef);
      
      if (snapshot.exists()) {
        const messageData = snapshot.val();
        if (messageData.authorId === userId.uid) {
          await remove(messageRef);
          return { ok: true };
        } else if (role === 'Admin') {
          await remove(messageRef);
          return { ok: true };
        } else {
          throw new Error("No tienes permiso para eliminar este mensaje");
        }
      }
      throw new Error("Mensaje no encontrado");
    } catch (error) {
      console.error("Error eliminando mensaje:", error);
      throw error;
    }
  }
}

export default Message; 