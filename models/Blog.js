"use client";
import { auth, db } from "@/lib/firebase/config";
import { ref, get, set, push, remove, query, orderByChild } from "firebase/database";

class Blog {
  static async create(blogData) {
    try {
      const blogsRef = ref(db, "blogs");
      const newBlogRef = push(blogsRef);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const newBlog = {
        title: blogData.title,
        content: blogData.content,
        imageUrl: blogData.imageUrl || "",
        author: user.displayName || "Administrador",
        authorId: user.uid,
        date: blogData.date || new Date().toLocaleDateString(),
        createdAt: new Date().toISOString()
      };

      await set(newBlogRef, newBlog);
      return { id: newBlogRef.key };
    } catch (error) {
      throw error;
    }
  }

  static async getAll(setBlogs) {
    try {
      const blogsRef = ref(db, "blogs");
      const snapshot = await get(blogsRef);
      
      if (snapshot.exists()) {
        const blogsArray = [];
        snapshot.forEach((childSnapshot) => {
          const blogData = childSnapshot.val();
          blogsArray.push({
            id: childSnapshot.key,
            ...blogData
          });
        });
        
        // Ordenar por fecha de creación, más reciente primero
        blogsArray.sort((a, b) => 
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        
        setBlogs(blogsArray);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error getting blogs:", error);
      throw error;
    }
  }

  static async delete(blogId) {
    try {
      const blogRef = ref(db, `blogs/${blogId}`);
      await remove(blogRef);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  }
}

export default Blog;
