"use client";
import Help from "@/models/Help";

class HelpController {
  static async getHelpContent(page = null) {
    try {
      const helpContent = await Help.getContent(page);
      return helpContent;
    } catch (error) {
      console.error("Error getting help content:", error);
      throw error;
    }
  }

  static async updateHelpContent(page, content) {
    try {
      await Help.updateContent(page, content);
      return { ok: true };
    } catch (error) {
      console.error("Error updating help content:", error);
      throw error;
    }
  }

  static async deletePage(page) {
    try {
      await Help.deletePage(page);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting help page:", error);
      throw error;
    }
  }

  static async getPages() {
    try {
      const pages = await Help.getPages();
      return pages;
    } catch (error) {
      console.error("Error getting help pages:", error);
      throw error;
    }
  }
}

export default HelpController;
