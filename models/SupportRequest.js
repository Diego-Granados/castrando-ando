"use client";
import { auth, db } from "@/lib/firebase/config";
import { ref, get, set, push, remove, query, orderByChild } from "firebase/database";

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

  static async getRequests(setRequests) {
    try {
      const requestsRef = ref(db, "supportRequests");
      const snapshot = await get(requestsRef);
      
      if (snapshot.exists()) {
        const requestsArray = [];
        snapshot.forEach((childSnapshot) => {
          const requestData = childSnapshot.val();
          requestsArray.push({
            id: childSnapshot.key,
            title: requestData.title,
            description: requestData.description,
            userName: requestData.userName,
            userId: requestData.userId,
            date: requestData.date,
          });
        });
        
        requestsArray.sort((a, b) => 
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        
        setRequests(requestsArray);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error getting support requests:", error);
      throw error;
    }
  }

  static async deleteRequest(requestId) {
    try {
      const requestRef = ref(db, `supportRequests/${requestId}`);
      await remove(requestRef);
      return true;
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  }
}

export default SupportRequest; 