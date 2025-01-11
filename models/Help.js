"use client";
import { db } from "@/lib/firebase/config";
import { ref, get, set } from "firebase/database";

class Help {
  static async getContent() {
    try {
      const helpRef = ref(db, "help");
      const snapshot = await get(helpRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return { sections: [] };
    } catch (error) {
      console.error("Error getting help content:", error);
      throw error;
    }
  }

  static async updateContent(content) {
    try {
      const helpRef = ref(db, "help");
      await set(helpRef, content);
      return true;
    } catch (error) {
      console.error("Error updating help content:", error);
      throw error;
    }
  }
}

export default Help; 