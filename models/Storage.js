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

  static async uploadFile(file, path) {
    try {
      // Create a form data object
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `${path}`);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );
      // Use fetch to upload directly to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`Error uploading file: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data.secure_url;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  static extractPublicId(url) {
    // Remove the Cloudinary domain and path prefix
    const parts = url.split("/image/upload/")[1]; // Keep only the part after "/image/upload/"

    // Remove the version string (v123456...) and file extension (.png, .jpg, etc.)
    const withoutVersion = parts.replace(/v\d+\//, ""); // Remove version if present
    const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); // Remove file extension

    return publicId;
  }

  static async deleteFile(url) {
    try {
      // Extract public_id from URL
      const publicId = Storage.extractPublicId(url);
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
}

export default Storage;
