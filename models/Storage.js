import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

class Storage {
  static async uploadFile(file, path) {
    const storageRef = ref(storage, `campaigns/${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
}

export default Storage;
