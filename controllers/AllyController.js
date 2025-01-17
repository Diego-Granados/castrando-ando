import { db } from "@/lib/firebase/config";
import { ref, set, get, update, remove, push } from "firebase/database";

class AllyController {
  static async createAlly(allyData) {
    try {
      const alliesRef = ref(db, "allies");
      const newAllyRef = push(alliesRef);
      await set(newAllyRef, allyData);
      return { id: newAllyRef.key, ...allyData };
    } catch (error) {
      console.error("Error creating ally:", error);
      throw error;
    }
  }

  static async getAllyById(id) {
    try {
      const allyRef = ref(db, `allies/${id}`);
      const snapshot = await get(allyRef);
      if (snapshot.exists()) {
        return { id, ...snapshot.val() };
      } else {
        throw new Error("No se ha encontrado ningún aliado con este ID.");
      }
    } catch (error) {
      console.error("Error getting ally:", error);
      throw error;
    }
  }

  static async getAllies() {
    try {
      const alliesRef = ref(db, "allies");
      const snapshot = await get(alliesRef);
      if (snapshot.exists()) {
        const allies = [];
        snapshot.forEach((childSnapshot) => {
          allies.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return allies;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error getting allies:", error);
      throw error;
    }
  }

  static async updateAlly(id, allyData) {
    try {
      const allyRef = ref(db, `allies/${id}`);
      await update(allyRef, allyData);
      return { id, ...allyData };
    } catch (error) {
      console.error("Error updating ally:", error);
      throw error;
    }
  }

  static async deleteAlly(id) {
    try {
      const allyRef = ref(db, `allies/${id}`);
      await remove(allyRef);
      return true;
    } catch (error) {
      console.error("Error deleting ally:", error);
      throw error;
    }
  }
}

export default AllyController;
