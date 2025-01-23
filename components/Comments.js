"use client";
import { useState, useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CommentController from '@/controllers/CommentController';

export default function Comments({ entityType, entityId, isAdmin }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, [isAdmin]);

  useEffect(() => {
    let unsubscribe;
    
    const loadComments = async () => {
      try {
        // Si todavía está cargando el usuario, esperar
        if (isLoadingUser) return;

        // Para blog, necesitamos usuario autenticado o ser admin
        if (entityType === 'blog' && !currentUser && !isAdmin) {
          setComments([]);
          return;
        }

        unsubscribe = await CommentController.getComments(entityType, entityId, setComments);
      } catch (error) {
        console.error('Error loading comments:', error);
        toast.error('Error al cargar los comentarios');
      }
    };

    loadComments();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [entityType, entityId, currentUser, isAdmin, isLoadingUser]);

  async function loadCurrentUser() {
    setIsLoadingUser(true);
    try {
      if (isAdmin) {
        setCurrentUser({
          uid: 'admin',
          role: 'Admin'
        });
      } else {
        const { user } = await CommentController.getCurrentUser();
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await CommentController.createComment({
        entityType,
        entityId,
        content: newComment.trim(),
        author: isAdmin ? 'Admin' : undefined,
        authorId: isAdmin ? 'admin' : undefined
      });

      if (result.ok) {
        setNewComment('');
        toast.success('Comentario publicado');
      } else {
        toast.error('Error al publicar el comentario');
      }
    } catch (error) {
      toast.error('Error al publicar el comentario');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(commentId) {
    try {
      const result = await CommentController.deleteComment(
        entityType,
        entityId,
        commentId,
        isAdmin
      );

      if (result.ok) {
        toast.success('Comentario eliminado');
      } else {
        toast.error('Error al eliminar el comentario');
      }
    } catch (error) {
      toast.error('Error al eliminar el comentario');
    }
  }

  // Si está cargando el usuario, mostrar un mensaje de carga
  if (isLoadingUser) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h3>Comentarios</h3>
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si es blog y no hay usuario autenticado ni es admin, mostrar mensaje de inicio de sesión
  if (entityType === 'blog' && !currentUser && !isAdmin) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h3>Comentarios</h3>
          <p className="text-muted">
            Debes iniciar sesión para ver y escribir comentarios
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body d-flex flex-column" style={{ minHeight: '500px' }}>
        <h3>Comentarios</h3>
        
        {/* Lista de comentarios en la parte superior con scroll */}
        <div className="comments-list flex-grow-1 overflow-auto mb-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted">No hay comentarios aún</p>
          ) : (
            comments.map(comment => (
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
                {(currentUser?.role === 'Admin' || currentUser?.uid === comment.authorId) && (
                  <div className="comment-actions mt-2">
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Formulario de comentario fijo en la parte inferior */}
        <div className="comment-form-container mt-auto">
          {currentUser ? (
            <form onSubmit={handleSubmit}>
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
          ) : (
            <p className="text-center text-muted">
              Debes iniciar sesión para comentar
            </p>
          )}
        </div>
      </div>

      <style jsx global>{`
        .comment-item {
          background-color: #f8f9fa;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }
        .comment-actions {
          margin-top: 0.5rem;
        }
        .comments-list {
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .comments-list > div:first-child {
          margin-top: 0;
        }
        .comments-list > div {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
} 