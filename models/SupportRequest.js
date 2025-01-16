"use client";
import { auth, db } from "@/lib/firebase/config";
import { ref, get, set, push, remove, query, orderByChild, onValue } from "firebase/database";

class SupportRequest {
  static async createRequest(requestData) {
    try {
      const requestsRef = ref(db, "supportRequests");
      const newRequestRef = push(requestsRef);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const newRequest = {
        title: requestData.title,
        description: requestData.description,
        userId: user.uid,
        userName: user.displayName || "Usuario Anónimo",
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString()
      };

      await set(newRequestRef, newRequest);
      return { id: newRequestRef.key };
    } catch (error) {
      throw error;
    }
  }

  static async getRequests(callback) {
    try {
      const requestsRef = ref(db, "supportRequests");
      const unsubscribe = onValue(requestsRef, (snapshot) => {
        callback(snapshot.val());
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error getting requests:", error);
      throw error;
    }
  }

  static async deleteRequest(requestId) {
    try {
      const requestRef = ref(db, `supportRequests/${requestId}`);
      await remove(requestRef);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting request:", error);
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
          status: newStatus
        });
        return { ok: true };
      } else {
        throw new Error("Solicitud no encontrada");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  }
}

export default SupportRequest; 