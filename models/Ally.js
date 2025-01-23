import { ref, get, set, update, remove } from "firebase/database";
import { db } from "@/lib/firebase/config";

class Ally {
  static async getAll() {
    const alliesRef = ref(db, "allies");
    const snapshot = await get(alliesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("No allies found");
      return [];
    }
  }

  static async getById(allyId) {
    const allyRef = ref(db, `allies/${allyId}`);
    const snapshot = await get(allyRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("No ally found with the given ID");
      return null;
    }
  }

  static async createAlly(allyData) {
    const newAllyRef = ref(db, `allies/${allyData.id}`);
    await set(newAllyRef, allyData);
  }

  static async updateAlly(allyId, allyData) {
    const allyRef = ref(db, `allies/${allyId}`);
    await update(allyRef, allyData);
  }

  static async deleteAlly(allyId) {
    const allyRef = ref(db, `allies/${allyId}`);
    await remove(allyRef);
  }
}

export default Ally;
