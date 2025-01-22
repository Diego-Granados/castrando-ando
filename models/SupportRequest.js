"use client";
import { db } from "@/lib/firebase/config";
import { ref, get, set, push, remove } from "firebase/database";

class SupportRequest {
  static async createRequest(requestData) {
    try {
      const requestsRef = ref(db, "supportRequests");
      const newRequestRef = push(requestsRef);

      const newRequest = {
        title: requestData.title,
        description: requestData.description,
        imageUrl: requestData.imageUrl || "",
        userId: requestData.userId,
        userName: requestData.userName,
        status: requestData.status || "Pendiente",
        date: requestData.date || new Date().toLocaleDateString(),
        createdAt: new Date().toISOString()
      };

      await set(newRequestRef, newRequest);
      return { id: newRequestRef.key };
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const requestsRef = ref(db, "supportRequests");
      const snapshot = await get(requestsRef);
      
      if (snapshot.exists()) {
        const requestsArray = [];
        snapshot.forEach((childSnapshot) => {
          const requestData = childSnapshot.val();
          requestsArray.push({
            id: childSnapshot.key,
            ...requestData,
            imageUrl: requestData.imageUrl || "",
            status: requestData.status || "Pendiente",
            date: requestData.date || new Date(requestData.createdAt || Date.now()).toLocaleDateString()
          });
        });
        
        // Ordenar por fecha de creación, más reciente primero
        requestsArray.sort((a, b) => 
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        
        return requestsArray;
      }
      return [];
    } catch (error) {
      console.error("Error getting requests:", error);
      throw error;
    }
  }

  static async getById(requestId) {
    try {
      const requestRef = ref(db, `supportRequests/${requestId}`);
      const snapshot = await get(requestRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return {
          id: requestId,
          ...data,
          imageUrl: data.imageUrl || "",
          status: data.status || "Pendiente",
          date: data.date || new Date(data.createdAt || Date.now()).toLocaleDateString()
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting request:", error);
      throw error;
    }
  }

  static async delete(requestId) {
    if (!requestId) {
      throw new Error("ID de solicitud requerido");
    }

    try {
      // Obtener referencia a la solicitud
      const requestRef = ref(db, `supportRequests/${requestId}`);
      
      // Verificar si existe la solicitud
      const snapshot = await get(requestRef);
      if (!snapshot.exists()) {
        throw new Error("La solicitud no existe");
      }

      // Obtener datos de la solicitud para la imagen
      const requestData = snapshot.val();

      // Si hay una imagen, eliminarla de Cloudinary
      if (requestData.imageUrl) {
        try {
          await fetch('/api/storage/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              urls: [requestData.imageUrl] 
            }),
          });
        } catch (imageError) {
          console.error("Error al eliminar imagen:", imageError);
          // Continuamos con la eliminación aunque falle la imagen
        }
      }

      // Eliminar la solicitud de Firebase
      await remove(requestRef);
      return true;
    } catch (error) {
      console.error("Error en delete:", error);
      throw error;
    }
  }

  static async updateStatus(requestId, newStatus) {
    try {
      const requestRef = ref(db, `supportRequests/${requestId}`);
      const snapshot = await get(requestRef);
      
      if (snapshot.exists()) {
        const currentData = snapshot.val();
        await set(requestRef, {
          ...currentData,
          status: newStatus,
          updatedAt: new Date().toISOString()
        });
      } else {
        throw new Error("Solicitud no encontrada");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  }

  static async getRequests(callback) {
    try {
      const requestsRef = ref(db, "supportRequests");
      const unsubscribe = onValue(requestsRef, (snapshot) => {
        if (snapshot.exists()) {
          const requestsData = snapshot.val();
          callback(requestsData);
        } else {
          callback(null);
        }
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error getting requests:", error);
      throw error;
    }
  }

  static async getUserData(uid) {
    try {
      // Obtener el ID de usuario (cédula) usando el UID
      const uidMapRef = ref(db, `uidToCedula/${uid}`);
      const uidMapSnapshot = await get(uidMapRef);
      
      if (!uidMapSnapshot.exists()) {
        throw new Error("No se encontraron datos del usuario");
      }

      const cedula = uidMapSnapshot.val();
      const userRef = ref(db, `users/${cedula}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        throw new Error("No se encontraron datos del usuario");
      }

      return userSnapshot.val();
    } catch (error) {
      console.error("Error getting user data:", error);
      throw error;
    }
  }
}

export default SupportRequest; 