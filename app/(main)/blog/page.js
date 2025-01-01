"use client";
import { Row, Col, Button } from "react-bootstrap";
import { useState } from "react";

export default function Blog() {
  const [blogPosts] = useState([
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3YNRu7aelgluNIXT1OXPXdS5Xr2TbFpPf8Q&s",
      date: "11/03/2024",
      author: "David Fernandez",
      title: "Heorica mama perro cuida sus crias",
      content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident..."
    },
    {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3YNRu7aelgluNIXT1OXPXdS5Xr2TbFpPf8Q&s",
        date: "11/03/2024",
        author: "David Fernandez",
        title: "Heorica mama perro cuida sus crias",
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident..."
      },
      {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3YNRu7aelgluNIXT1OXPXdS5Xr2TbFpPf8Q&s",
        date: "11/03/2024",
        author: "David Fernandez",
        title: "Heorica mama perro cuida sus crias",
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident... At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non providentAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non providentAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non providentAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident"
      },
      {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3YNRu7aelgluNIXT1OXPXdS5Xr2TbFpPf8Q&s",
        date: "11/03/2024",
        author: "David Fernandez",
        title: "Heorica mama perro cuida sus crias",
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident..."
      }
  ]);

  return (
    <main className="container">
      <h1 className="text-center mb-4">Blog</h1>
      
      <div className="d-flex justify-content-end mb-4">
        <Button 
          variant="primary"
          className="rounded-pill"
          style={{ padding: "10px 20px" }}
        >
          CREAR BLOG
        </Button>
      </div>

      <Row className="g-4">
        {blogPosts.map((post, index) => (
          <Col key={index} xs={12} md={6} lg={4}>
            <div className="card shadow-sm h-100">
              <img
                src={post.image}
                className="card-img-top"
                alt=""
                style={{
                  height: "250px",
                  objectFit: "cover"
                }}
              />
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
    </main>
  );
}