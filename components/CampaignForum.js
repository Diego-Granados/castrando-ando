"use client";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import CampaignCommentController from "@/controllers/CampaignCommentController";
import { toast } from "react-toastify";
import useSubscription from "@/hooks/useSubscription";
import AuthController from "@/controllers/AuthController";

export default function CampaignForum({ campaignId }) {
  const [newComment, setNewComment] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [comments, setComments] = useState([]);
  const [userUid, setUserUid] = useState(null);

  // Usar useSubscription para los comentarios
  const { loading, error } = useSubscription(() =>
    CampaignCommentController.getComments(campaignId, setComments)
  );

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { user, role } = await AuthController.getCurrentUser();

      if (!user) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setUserUid(user.uid);
      }
      if (role === "Admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
    } finally {
      setAuthChecking(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const result = await CampaignCommentController.createComment(
        campaignId,
        newComment
      );
      if (result.ok) {
        setNewComment("");
      } else {
        toast.error(result.error || "Error al enviar el comentario");
      }
    } catch (error) {
      console.error("Error enviando comentario:", error);
      toast.error("Error al enviar el comentario");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const result = await CampaignCommentController.deleteComment(
        campaignId,
        commentId
      );
      if (!result.ok) {
        toast.error(result.error || "Error al eliminar el comentario");
      }
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      toast.error("Error al eliminar el comentario");
    }
  };

  if (loading || authChecking) {
    return <div className="p-4">Cargando comentarios...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger">Error: {error.message}</div>;
  }

  return (
    <div className="campaign-forum p-4">
      <h3 className="mb-4">Comentarios</h3>

      <div
        className="comments-container mb-4"
        style={{
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {comments.length === 0 ? (
          <p className="text-center text-muted">No hay comentarios aún</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`comment mb-3 p-3 border rounded ${
                isAuthenticated && comment.authorId === userUid
                  ? "ms-auto"
                  : "me-auto"
              }`}
              style={{ maxWidth: "80%" }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <strong>{comment.author}</strong>
                <small className="text-muted">{comment.createdAt}</small>
              </div>
              <p className="mb-1">{comment.content}</p>
              {(isAdmin ||
                (isAuthenticated && comment.authorId === userUid)) && (
                <Button
                  variant="link"
                  className="p-0 text-danger"
                  onClick={() => handleDelete(comment.id)}
                >
                  🗑️
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      {isAuthenticated ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="input"
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu comentario..."
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Enviar comentario
          </Button>
        </Form>
      ) : (
        <p className="text-center text-muted">
          Debes iniciar sesión para comentar
        </p>
      )}
    </div>
  );
}
