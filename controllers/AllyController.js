import Ally from "@/models/Ally";

class AllyController {
  static async getAllAllies() {
    return await Ally.getAll();
  }

  static async getAllyById(allyId) {
    return await Ally.getById(allyId);
  }

  static async createOrUpdateAlly(allyData, file) {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("path", "allies");

        const response = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error uploading file: ${response.statusText}`);
        }

        const downloadURLs = await response.json();
        allyData.image = downloadURLs[0];
      }

      if (allyData.id) {
        const existingAlly = await Ally.getById(allyData.id);
        if (existingAlly && existingAlly.image !== allyData.image) {
          console.log("Deleting existing image:", existingAlly.image); // Debugging log
          await fetch("/api/storage/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ urls: [existingAlly.image] }),
          });
        }
        await Ally.updateAlly(allyData.id, allyData);
      } else {
        allyData.id = Date.now().toString();
        await Ally.createAlly(allyData);
      }
    } catch (error) {
      throw new Error(`Error saving ally: ${error.message}`);
    }
  }

  static async deleteAlly(allyId) {
    try {
      const ally = await Ally.getById(allyId);
      if (ally && ally.image) {
        console.log("Deleting ally image:", ally.image); // Debugging log
        await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: [ally.image] }),
        });
      }
      return await Ally.deleteAlly(allyId);
    } catch (error) {
      throw new Error(`Error deleting ally: ${error.message}`);
    }
  }
}

export default AllyController;
