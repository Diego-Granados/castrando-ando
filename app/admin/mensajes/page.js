"use client";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Comments from "@/components/Comments";
import AuthController from "@/controllers/AuthController";

export default function Mensajes() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { role } = await AuthController.getCurrentUser();
        setIsAdmin(role === "Admin");
      } catch (error) {
        console.error("Error verificando autenticación:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <Container className="py-4">Cargando...</Container>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="flex-grow-1 py-4">
        <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
          Mensajes
        </h1>

        <Comments 
          entityType="messages" 
          entityId="global" 
          isAdmin={isAdmin}
        />
      </Container>
    </div>
  );
}
