"use client";
import Blog from "@/models/Blog";
import Auth from "@/models/Auth";
import { auth } from "@/lib/firebase/config";

class BlogController {
  static async createBlog(blogData) {
    try {
      const user = await Auth.getCurrentUser();
      if (!user) {
        return { ok: false, error: "Usuario no autenticado" };
      }

      const result = await Blog.createBlog({
        ...blogData,
        authorId: user.uid,
        author: user.displayName || user.email
      });

      return { ok: true, id: result.id };
    } catch (error) {
      console.error("Error creating blog:", error);
      return { ok: false, error: error.message };
    }
  }

  static async getBlogs(setBlogs) {
    try {
      await Blog.getBlogs(setBlogs);
      return { ok: true };
    } catch (error) {
      console.error("Error getting blogs:", error);
      return { ok: false, error: error.message };
    }
  }

  static isUserAuthenticated() {
    return auth.currentUser !== null;
  }
}

export default BlogController; 