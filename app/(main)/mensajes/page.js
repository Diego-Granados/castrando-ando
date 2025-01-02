"use client";
import { useEffect, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import MessageController from "@/controllers/MessageController";
import { FaTrash } from 'react-icons/fa';

export default function MessageWall() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        await MessageController.getMessages(setMessages);
        setIsAuthenticated(MessageController.isUserAuthenticated());
      } catch (error) {
        console.error("Error cargando mensajes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const result = await MessageController.createMessage(newMessage);
      if (result.ok) {
        setNewMessage("");
        await MessageController.getMessages(setMessages);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Error al enviar el mensaje");
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const result = await MessageController.deleteMessage(messageId);
      if (result.ok) {
        await MessageController.getMessages(setMessages);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error eliminando mensaje:", error);
      alert("Error al eliminar el mensaje");
    }
  };

  if (loading) {
    return <div className="text-center">Cargando mensajes...</div>;
  }

  return (
    <main className="container py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Mensajes de la comunidad
      </h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body" style={{ maxHeight: "600px", overflowY: "auto" }}>
          {messages.length === 0 ? (
            <p className="text-center">No hay mensajes aún</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 p-3 border rounded ${
                  MessageController.isUserAuthenticated() &&
                  message.authorId === auth.currentUser?.uid
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
                {MessageController.isUserAuthenticated() &&
                  message.authorId === auth.currentUser?.uid && (
                    <Button
                      variant="link"
                      className="p-0 text-danger"
                      onClick={() => handleDelete(message.id)}
                    >
                      <FaTrash />
                    </Button>
                  )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {isAuthenticated ? (
        <Form onSubmit={handleSubmit} className="d-flex gap-2">
          <Form.Control
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-grow-1"
          />
          <Button type="submit" variant="primary">
            Enviar
          </Button>
        </Form>
      ) : (
        <p className="text-center">
          Debes iniciar sesión para enviar mensajes
        </p>
      )}
    </main>
  );
} 