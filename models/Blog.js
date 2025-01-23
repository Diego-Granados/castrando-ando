"use client";
import { db } from "@/lib/firebase/config";
import { ref, get, set, push, remove } from "firebase/database";

class Blog {
  static async create(blogData) {
    try {
      const blogsRef = ref(db, "blogs");
      const newBlogRef = push(blogsRef);
      
      const newBlog = {
        title: blogData.title,
        content: blogData.content,
        imageUrl: blogData.imageUrl || "",
        author: blogData.author || "Admin",
        authorId: blogData.authorId,
        date: blogData.date || new Date().toLocaleDateString(),
        createdAt: blogData.createdAt || new Date().toISOString()
      };

      await set(newBlogRef, newBlog);
      return { id: newBlogRef.key };
    } catch (error) {
      console.error("Error creating blog:", error);
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
    if (!blogId) {
      throw new Error("ID del blog requerido");
    }

    try {
      // Obtener referencia al blog
      const blogRef = ref(db, `blogs/${blogId}`);
      
      // Verificar si existe el blog y obtener sus datos
      const snapshot = await get(blogRef);
      if (!snapshot.exists()) {
        throw new Error("El blog no existe");
      }

      // Obtener datos del blog para la imagen
      const blogData = snapshot.val();

      // Si hay una imagen, eliminarla de Cloudinary
      if (blogData.imageUrl) {
        try {
          await fetch('/api/storage/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              urls: [blogData.imageUrl] 
            }),
          });
        } catch (imageError) {
          console.error("Error al eliminar imagen:", imageError);
          // Continuamos con la eliminación aunque falle la imagen
        }
      }

      // Eliminar el blog de Firebase
      await remove(blogRef);
      return true;
    } catch (error) {
      console.error("Error en delete:", error);
      throw error;
    }
  }
}

export default Blog;
