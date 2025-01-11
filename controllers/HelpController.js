"use client";
import Help from "@/models/Help";

class HelpController {
  static async getHelpContent() {
    try {
      const helpContent = await Help.getContent();
      return helpContent;
    } catch (error) {
      console.error("Error getting help content:", error);
      throw error;
    }
  }

  static async updateHelpContent(content) {
    try {
      await Help.updateContent(content);
      return { ok: true };
    } catch (error) {
      console.error("Error updating help content:", error);
      throw error;
    }
  }
}

export default HelpController; 