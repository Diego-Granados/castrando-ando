"use server";
import Storage from "@/models/Storage";

class StorageController {
  static async uploadFiles(fileList, path) {
    const downloadURLs = [];
    for (const file of fileList) {
      try {
        const downloadURL = await Storage.uploadFile(file, path);
        downloadURLs.push(downloadURL);
      } catch (error) {
        throw new Error(`Error uploading file ${file.name}: ${error.message}`);
      }
    }
    return downloadURLs;
  }

  static async deleteFiles(urls) {
    for (const url of urls) {
      await Storage.deleteFile(url);
    }
  }
}

export default StorageController;
