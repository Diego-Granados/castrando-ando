"use client";
import { auth, db } from "@/lib/firebase/config";
import { ref, get, set, push, remove, query, orderByChild } from "firebase/database";

class Blog {
  static async createBlog(blogData) {
    try {
      const blogsRef = ref(db, "blogs");
      const newBlogRef = push(blogsRef);
      
      const newBlog = {
        title: blogData.title,
        content: blogData.content,
        imageUrl: blogData.imageUrl || "",
        author: blogData.author,
        authorId: blogData.authorId,
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString()
      };

      await set(newBlogRef, newBlog);
      return { id: newBlogRef.key };
    } catch (error) {
      throw error;
    }
  }

  static async getBlogs(setBlogs) {
    try {
      const blogsRef = ref(db, "blogs");
      const snapshot = await get(blogsRef);
      
      if (snapshot.exists()) {
        const blogsArray = [];
        snapshot.forEach((childSnapshot) => {
          const blogData = childSnapshot.val();
          blogsArray.push({
            id: childSnapshot.key,
            title: blogData.title,
            content: blogData.content,
            imageUrl: blogData.imageUrl,
            author: blogData.author,
            date: blogData.date,
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
}

export default Blog;
