"use client";

import { useEffect, useState } from "react";

import { Row, Col, Button, Image, Modal } from "react-bootstrap";

import Link from "next/link";

import BlogController from "@/controllers/BlogController";
import { toast } from "react-toastify";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const MAX_CONTENT_LENGTH = 100; // Máximo de caracteres a mostrar
  const truncateText = (text) => {

    if (text.length <= MAX_CONTENT_LENGTH) return text;

    return text.substring(0, MAX_CONTENT_LENGTH) + "...";

  };

  useEffect(() => {

    const loadBlogs = async () => {

      try {
        await BlogController.getBlogs(setBlogPosts);
        const adminStatus = await BlogController.isUserAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error cargando blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const handleDeleteClick = (e, blog) => {
    e.stopPropagation(); // Evitar que se abra el modal del blog
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteBlog = async () => {
    try {
      const result = await BlogController.deleteBlog(blogToDelete.id);
      if (result.ok) {
        toast.success("Blog eliminado correctamente");
        // Actualizar la lista de blogs
        await BlogController.getBlogs(setBlogPosts);
      } else {
        toast.error(result.error || "Error al eliminar el blog");
      }
    } catch (error) {
      console.error("Error eliminando blog:", error);
      toast.error("Error al eliminar el blog");
    } finally {
      setShowDeleteModal(false);
      setBlogToDelete(null);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;

  }
  return (
    <main className="container">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>Blog</h1>
      {isAdmin && (
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
              <div
                className="card shadow-sm h-100 blog-card"
                onClick={() => {
                  setSelectedPost(post);
                  setShowModal(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

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
                    {truncateText(post.content)}
                  </p>
                  {isAdmin && (
                    <div className="text-end mt-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => handleDeleteClick(e, post)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
      {/* Modal para mostrar el post completo */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        {selectedPost && (
          <>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#2055A5" }}>
                {selectedPost.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedPost.imageUrl && (
                <Image
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-100 mb-3"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              )}
              <div className="d-flex justify-content-between mb-3">
                <small className="text-muted">{selectedPost.date}</small>
                <small className="text-muted">Autor: {selectedPost.author}</small>
              </div>
              <p style={{ whiteSpace: 'pre-line' }}>{selectedPost.content}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setBlogToDelete(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar el blog "{blogToDelete?.title}"?
          Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setBlogToDelete(null);
            }}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteBlog}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .blog-card {
          transition: transform 0.2s ease-in-out;
        }
        .blog-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </main>
  );
}