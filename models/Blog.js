"use client";
import { auth, db } from "@/lib/firebase/config";
import { ref, set, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

class Blog {
  static async createBlog(title, content, imageFile, author, authorId) {
    try {
      // Generar un ID único para el blog
      const blogId = Date.now().toString();
      
      // Subir la imagen a Firebase Storage (si existe)
      let imageUrl = null;
      if (imageFile) {
        const storage = getStorage();
        const fileName = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const imageRef = storageRef(storage, `blog_images/${fileName}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Crear entrada en la base de datos
      const blogRef = ref(db, `blog/${blogId}`);
      const blogData = {
        title,
        content,
        imageUrl,
        author,
        authorId,
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
      };

      await set(blogRef, blogData);
      console.log("Blog creado exitosamente:", blogData);

      return { ok: true, blogId };
    } catch (error) {
      console.error("Error en Blog model:", error);
      throw error;
    }
  }

  static async getBlogs(setBlogs) {
    try {
      const blogsRef = ref(db, 'blog');
      const snapshot = await get(blogsRef);
      if (snapshot.exists()) {
        const blogsData = snapshot.val();
        const blogsArray = Object.entries(blogsData).map(([id, blog]) => ({
          id,
          ...blog
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log("Blogs obtenidos:", blogsArray);
        setBlogs(blogsArray);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error obteniendo blogs:", error);
      throw error;
    }
  }
}

export default Blog;
