"use client";
import { db } from "@/lib/firebase/config";
import { ref, get, set, child } from "firebase/database";

class Help {
  static async getContent(page) {
    try {
      const helpRef = ref(db, `help/${page}`);
      const snapshot = await get(helpRef);
      if (snapshot.exists() && snapshot.val().enabled) {
        const data = snapshot.val();
        return { sections: data.sections || [] };
      }
      return { sections: [] };
    } catch (error) {
      console.error("Error getting help content:", error);
      throw error;
    }
  }

  static async updateContent(page, content) {
    try {
      const helpRef = ref(db, `help/${page}`);
      content.enabled = true;
      await set(helpRef, content);
      return true;
    } catch (error) {
      console.error("Error updating help content:", error);
      throw error;
    }
  }

  static async deletePage(page) {
    try {
      const helpRef = ref(db, `help/${page}`);
      await set(helpRef, { sections: [], enabled: false });
      return true;
    } catch (error) {
      console.error("Error deleting help page:", error);
      throw error;
    }
  }

  static async getPages() {
    try {
      const helpRef = ref(db, "help");
      const snapshot = await get(helpRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).filter((key) => data[key].enabled === true);
      }
      return [];
    } catch (error) {
      console.error("Error getting help pages:", error);
      throw error;
    }
  }
}

export default Help;
