"use client";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import BlogController from "@/controllers/BlogController";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        await BlogController.getBlogs(setBlogPosts);
        setIsAuthenticated(BlogController.isUserAuthenticated());
      } catch (error) {
        console.error("Error cargando blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  if (loading) {
    return <div className="text-center">Cargando blogs...</div>;
  }

  return (
    <main className="container">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>Blog</h1>
      
      {isAuthenticated && (
        <div className="d-flex justify-content-end mb-4">
          <Link href="/blog/crear" passHref>
            <Button 
              variant="primary"
              className="rounded-pill"
              style={{ padding: "10px 20px" }}
            >
              CREAR BLOG
            </Button>
          </Link>
        </div>
      )}

      {blogPosts.length === 0 ? (
        <div className="text-center">
          <h2>No hay blogs publicados aún</h2>
        </div>
      ) : (
        <Row className="g-4">
          {blogPosts.map((post) => (
            <Col key={post.id} xs={12} md={6} lg={4}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">{post.date}</small>
                    <small className="text-muted">Autor: {post.author}</small>
                  </div>
                  <h2 
                    className="card-title text-center"
                    style={{ color: "#2055A5", fontSize: "1.5rem" }}
                  >
                    {post.title}
                  </h2>
                  <p className="card-text text-center">
                    {post.content}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </main>
  );
}