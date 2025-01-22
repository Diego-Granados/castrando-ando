"use client";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import AuthController from "@/controllers/AuthController";

class BlogController {
  static async createBlog(blogData) {
    try {
      const { user, role } = await AuthController.getCurrentUser();
      if (!user || role !== "Admin") {
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
      if (!user || role !== "Admin") {
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
    return AuthController.isUserAuthenticated();
  }

  static async isUserAdmin() {
    try {
      const { role } = await AuthController.getCurrentUser();
      return role === "Admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

export default BlogController; 