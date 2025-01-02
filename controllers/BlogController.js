import Blog from "@/models/Blog";
import { auth, db } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";

class BlogController {
  static async getCurrentUser() {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error("No hay usuario autenticado");
      }

      // Obtener la cédula del usuario
      const cedulaRef = ref(db, `uidToCedula/${firebaseUser.uid}`);
      const cedulaSnapshot = await get(cedulaRef);
      const cedula = cedulaSnapshot.val();

      // Obtener los datos del usuario
      const userRef = ref(db, `users/${cedula}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData) {
        throw new Error("No se encontraron datos del usuario");
      }

      return {
        ...userData,
        uid: firebaseUser.uid
      };
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
      throw error;
    }
  }

  static async createBlog(title, content, imageFile = null) {
    try {
      // Validaciones básicas
      if (!title || !content) {
        throw new Error("El título y el contenido son obligatorios");
      }

      // Obtener información del usuario actual
      const currentUser = await this.getCurrentUser();
      
      if (!currentUser) {
        throw new Error("Debes iniciar sesión para crear un blog");
      }

      const result = await Blog.createBlog(
        title, 
        content,
        imageFile,
        currentUser.name,
        currentUser.uid
      );
      
      return { ok: true, blogId: result.blogId };
    } catch (error) {
      console.error("Error en BlogController:", error);
      return { ok: false, error: error.message };
    }
  }

  static async getBlogs(setBlogs) {
    try {
      await Blog.getBlogs(setBlogs);
      return { ok: true };
    } catch (error) {
      console.error("Error obteniendo blogs:", error);
      return { ok: false, error: error.message };
    }
  }

  static isUserAuthenticated() {
    return auth.currentUser !== null;
  }
}

export default BlogController; 