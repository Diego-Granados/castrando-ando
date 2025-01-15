"use client";
import { Button, Form } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase/config";
import CampaignCommentController from "@/controllers/CampaignCommentController";

export default function CampaignForum({ campaignId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (campaignId) {
      const loadData = async () => {
        try {
          await CampaignCommentController.getComments(campaignId, setComments);
          setIsAuthenticated(CampaignCommentController.isUserAuthenticated());
          
          // Verificar si el usuario es administrador
          const adminStatus = await CampaignCommentController.isUserAdmin();
          console.log("Estado de admin:", adminStatus); // Para debugging
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error cargando datos:", error);
        }
      };
      
      loadData();
    }
  }, [campaignId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const result = await CampaignCommentController.createComment(campaignId, newComment);
      if (result.ok) {
        setNewComment("");
        await CampaignCommentController.getComments(campaignId, setComments);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error enviando comentario:", error);
      alert("Error al enviar el comentario");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const result = await CampaignCommentController.deleteComment(campaignId, commentId);
      if (result.ok) {
        await CampaignCommentController.getComments(campaignId, setComments);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      alert("Error al eliminar el comentario");
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h3 className="text-center mb-4">Preguntas sobre la campaña</h3>
        
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          {comments.length === 0 ? (
            <p className="text-center">No hay preguntas aún</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`mb-3 p-3 border rounded ${
                  isAuthenticated && comment.authorId === auth.currentUser?.uid
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
                {(isAdmin || (isAuthenticated && comment.authorId === auth.currentUser?.uid)) && (
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
          <div ref={messagesEndRef} />
        </div>

        {isAuthenticated ? (
          <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group className="d-flex gap-2">
              <Form.Control
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu pregunta..."
              />
              <Button type="submit" variant="primary">
                Enviar
              </Button>
            </Form.Group>
          </Form>
        ) : (
          <p className="text-center mt-3">
            Debes iniciar sesión para hacer preguntas
          </p>
        )}
      </div>
    </div>
  );
} 