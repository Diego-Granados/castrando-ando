"use client";
import { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import AdminSupportRequestController from "@/controllers/AdminSupportRequestController";

export default function AdminSolicitudes() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      await AdminSupportRequestController.getAllRequests(setRequests);
    } catch (error) {
      setError("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta solicitud?")) {
      return;
    }

    try {
      const result = await AdminSupportRequestController.deleteRequest(requestId);
      if (result.ok) {
        await loadRequests();
      } else {
        setError(result.error || "Error al eliminar la solicitud");
      }
    } catch (error) {
      setError("Error al eliminar la solicitud");
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div>Cargando...</div>
      </Container>
    );
  }

  return (
    <main className="container py-4" style={{ minHeight: "calc(100vh - 200px)" }}>
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Administración de Solicitudes
      </h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {requests.length === 0 ? (
            <Alert variant="info">No hay solicitudes pendientes</Alert>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.date}</td>
                    <td>{request.userName}</td>
                    <td>{request.title}</td>
                    <td>{request.description}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(request.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </main>
  );
} 