"use server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class Storage {
  //   static async uploadFile(file, path) {
  //     const storageRef = ref(storage, `campaigns/${path}/${file.name}`);
  //     await uploadBytes(storageRef, file);
  //     const downloadURL = await getDownloadURL(storageRef);
  //     return downloadURL;
  //   }

  // File musts be base64
  static async uploadFile(file, path) {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file, {
        folder: `campaigns/${path}`,
        resource_type: "auto",
      });

      return result.secure_url;
    } catch (error) {
      console.error(error);
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  static async deleteFile(url) {
    try {
      // Extract public_id from URL
      const publicId = url.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
}

export default Storage;
