"use client";
import { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import MessageController from "@/controllers/MessageController";
import { toast } from "react-toastify";
import useSubscription from "@/hooks/useSubscription";
import AuthController from "@/controllers/AuthController";

export default function Mensajes() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [userUid, setUserUid] = useState(null);

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

  // Usar useSubscription para los mensajes
  const { loading, error } = useSubscription(() =>
    MessageController.getMessages(setMessages)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const result = await MessageController.createMessage(newMessage);
      if (result.ok) {
        setNewMessage("");
      } else {
        toast.error(result.error || "Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      toast.error("Error al enviar el mensaje");
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const result = await MessageController.deleteMessage(messageId);
      if (!result.ok) {
        toast.error(result.error || "Error al eliminar el mensaje");
      }
    } catch (error) {
      console.error("Error eliminando mensaje:", error);
      toast.error("Error al eliminar el mensaje");
    }
  };

  if (loading || authChecking) {
    return <Container className="py-4">Cargando mensajes...</Container>;
  }

  if (error) {
    return <Container className="py-4">Error: {error.message}</Container>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="flex-grow-1 py-4">
        <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
          Mensajes
        </h1>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div
              className="messages-container"
              style={{
                maxHeight: "calc(100vh - 300px)",
                minHeight: "300px",
                overflowY: "auto",
                marginBottom: "1rem",
              }}
            >
              {messages.length === 0 ? (
                <p className="text-center">No hay mensajes aún</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 p-3 border rounded ${
                      isAuthenticated && message.authorId === userUid
                        ? "ms-auto"
                        : "me-auto"
                    }`}
                    style={{ maxWidth: "80%" }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <strong>{message.author}</strong>
                      <small className="text-muted">{message.createdAt}</small>
                    </div>
                    <p className="mb-1">{message.content}</p>
                    {(isAdmin ||
                      (isAuthenticated && message.authorId === userUid)) && (
                      <Button
                        variant="link"
                        className="p-0 text-danger"
                        onClick={() => handleDelete(message.id)}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>

            {isAuthenticated ? (
              <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Group className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                  />
                  <Button type="submit" variant="primary">
                    Enviar
                  </Button>
                </Form.Group>
              </Form>
            ) : (
              <p className="text-center mt-3">
                Debes iniciar sesión para enviar mensajes
              </p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
