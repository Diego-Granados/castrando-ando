"use client";
import Blog from "@/models/Blog";
import Auth from "@/models/Auth";
import { auth } from "@/lib/firebase/config";

class BlogController {
  static async createBlog(blogData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      // Verificar si es admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        return { ok: false, error: "No tienes permisos para crear blogs" };
      }

      const result = await Blog.create(blogData);
      return { ok: true, id: result.id };
    } catch (error) {
      console.error("Error creating blog:", error);
      return { ok: false, error: error.message };
    }
  }

  static async getBlogs(setBlogs) {
    try {
      await Blog.getAll(setBlogs);
    } catch (error) {
      console.error("Error getting blogs:", error);
      throw error;
    }
  }

  static async deleteBlog(blogId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      // Verificar si es admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        return { ok: false, error: "No tienes permisos para eliminar blogs" };
      }

      await Blog.delete(blogId);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting blog:", error);
      return { ok: false, error: error.message };
    }
  }

  static isUserAuthenticated() {
    return auth.currentUser !== null;
  }

  static async isUserAdmin() {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      const userRole = await Auth.getUserRole(user.uid);
      return userRole === "Admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

export default BlogController; 