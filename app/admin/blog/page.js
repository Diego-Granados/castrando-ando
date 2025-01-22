"use client";
import { useEffect, useState, useRef } from "react";
import { Row, Col, Button, Image, Modal } from "react-bootstrap";
import Link from "next/link";
import BlogController from "@/controllers/BlogController";
import { toast } from "react-toastify";
import CommentController from "@/controllers/CommentController";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

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

  // Cargar usuario actual
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        setIsLoadingUser(true);
        const { user } = await CommentController.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    loadCurrentUser();
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

  // Cargar comentarios cuando se selecciona un post
  useEffect(() => {
    if (selectedPost) {
      loadComments();
    }
  }, [selectedPost]);

  const loadComments = async () => {
    if (!selectedPost) return;
    
    const result = await CommentController.getComments('blog', selectedPost.id);
    if (result.ok) {
      setComments(result.comments);
    } else {
      toast.error('Error al cargar los comentarios');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await CommentController.createComment({
        entityType: 'blog',
        entityId: selectedPost.id,
        content: newComment.trim(),
        author: 'Admin', // Forzamos el nombre como Admin
        authorId: 'admin' // ID fijo para admin
      });

      if (result.ok) {
        setNewComment('');
        await loadComments();
        toast.success('Comentario publicado');
      } else {
        toast.error('Error al publicar el comentario');
      }
    } catch (error) {
      toast.error('Error al publicar el comentario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const result = await CommentController.deleteComment(
        'blog',
        selectedPost.id,
        commentId,
        true // Indicamos que es una eliminación desde admin
      );

      if (result.ok) {
        await loadComments();
        toast.success('Comentario eliminado');
      } else {
        toast.error(result.error || 'Error al eliminar el comentario');
      }
    } catch (error) {
      toast.error('Error al eliminar el comentario');
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
          <Link href="/admin/blog/crear" passHref>
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
      {/* Modal modificado para mostrar comentarios */}
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
              
              {/* Sección de comentarios */}
              <div className="comments-section mt-4">
                <h4>Comentarios</h4>
                
                {/* Formulario de comentario */}
                <form onSubmit={handleSubmitComment} className="mb-4">
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !newComment.trim()}
                  >
                    {isLoading ? 'Publicando...' : 'Publicar comentario'}
                  </Button>
                </form>

                {/* Lista de comentarios */}
                <div className="comments-list">
                  {comments.map(comment => (
                    <div key={comment.id} className="comment-item p-3 mb-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {comment.authorAvatar && (
                            <Image
                              src={comment.authorAvatar}
                              alt={comment.author}
                              roundedCircle
                              width={32}
                              height={32}
                              className="me-2"
                            />
                          )}
                          <strong>{comment.author}</strong>
                        </div>
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mt-2 mb-1">{comment.content}</p>
                      <div className="comment-actions mt-2">
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
        .comment-item {
          background-color: #f8f9fa;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }
        .comment-actions {
          margin-top: 0.5rem;
        }
        .comments-section {
          border-top: 1px solid #dee2e6;
          padding-top: 1.5rem;
        }
      `}</style>
    </main>
  );
}