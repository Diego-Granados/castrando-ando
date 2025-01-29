"use client";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import AuthController from "@/controllers/AuthController";

class BlogController {
  static async createBlog(blogData) {
    try {
      const { user, role } = await AuthController.getCurrentUser();
      
      // Verificar si el usuario está autenticado
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      // Verificar si el usuario es admin
      if (role !== "Admin") {
        return { ok: false, error: "No tienes permisos para crear blogs" };
      }

      const enrichedBlogData = {
        ...blogData,
        author: "Admin",
        authorId: user.uid,
        createdAt: new Date().toISOString()
      };

      const result = await Blog.create(enrichedBlogData);
      return { ok: true, id: result.id };
    } catch (error) {
      console.error("Error creating blog:", error);
      return { ok: false, error: "Error al crear el blog" };
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
      const { user, role } = await AuthController.getCurrentUser();
      
      // Verificar si el usuario está autenticado
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      // Verificar si el usuario es admin
      if (role !== "Admin") {
        return { ok: false, error: "No tienes permisos para eliminar blogs" };
      }

      // Primero eliminamos los comentarios asociados al blog
      await Comment.deleteAllFromEntity('blog', blogId);
      
      // Luego eliminamos el blog
      await Blog.delete(blogId);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting blog:", error);
      return { ok: false, error: "Error al eliminar el blog" };
    }
  }

  static async isUserAuthenticated() {
    try {
      const { user } = await AuthController.getCurrentUser();
      return user !== null;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  static async isUserAdmin() {
    try {
      const { user, role } = await AuthController.getCurrentUser();
      return user !== null && role === "Admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }

  static async getBlogByIdOnce(blogId) {
    try {
      const blog = await Blog.getBlogByIdOnce(blogId);
      if (!blog) {
        throw new Error("Blog no encontrado");
      }
      return blog;
    } catch (error) {
      console.error("Error getting blog:", error);
      throw error;
    }
  }
}

export default BlogController; 