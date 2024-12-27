"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthController from "@/controllers/AuthController";
import { Container, Spinner } from "react-bootstrap";

export default function RouteGuard({ children, requiredRole }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { user, role } = await AuthController.getCurrentUser();

      if (!user || (requiredRole && role !== requiredRole)) {
        setAuthorized(false);
        router.push("/userLogin");
      } else {
        setAuthorized(true);
      }
    } catch (error) {
      setAuthorized(false);
      router.push("/userLogin");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return authorized ? children : null;
}
