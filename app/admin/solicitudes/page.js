"use client";
import { useState, useEffect } from "react";
import { Container, Table, Badge, Button, Dropdown } from "react-bootstrap";
import AdminSupportRequestController from "@/controllers/AdminSupportRequestController";
import { toast } from "react-toastify";
import { db } from "@/lib/firebase/config";
import { ref, get, off } from "firebase/database";

export default function Solicitudes() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    const loadRequests = async () => {
      try {
        // Desuscribirse de cualquier listener anterior
        const requestsRef = ref(db, "supportRequests");
        off(requestsRef);

        unsubscribe = await AdminSupportRequestController.getAllRequests(async (requestsData) => {
          try {
            if (!requestsData) {
              setRequests([]);
              return;
            }

            const tempRequests = Object.entries(requestsData).map(([id, request]) => ({
              id,
              ...request
            }));

            const requestsWithUserData = await Promise.all(
              tempRequests.map(async (request) => {
                try {
                  if (!request.userId) {
                    return {
                      ...request,
                      userName: 'Usuario desconocido'
                    };
                  }

                  const uidMapRef = ref(db, `uidToCedula/${request.userId}`);
                  const uidMapSnapshot = await get(uidMapRef);
                  
                  if (!uidMapSnapshot.exists()) {
                    return {
                      ...request,
                      userName: 'Usuario desconocido'
                    };
                  }

                  const cedula = uidMapSnapshot.val();
                  const userRef = ref(db, `users/${cedula}`);
                  const userSnapshot = await get(userRef);
                  
                  if (!userSnapshot.exists()) {
                    return {
                      ...request,
                      userName: 'Usuario desconocido'
                    };
                  }

                  const userData = userSnapshot.val();
                  return {
                    ...request,
                    userName: userData.name || 'Usuario desconocido'
                  };
                } catch (error) {
                  console.error("Error obteniendo datos del usuario:", error);
                  return {
                    ...request,
                    userName: 'Usuario desconocido'
                  };
                }
              })
            );

            setRequests(requestsWithUserData);
          } catch (error) {
            console.error("Error procesando solicitudes:", error);
            toast.error("Error al procesar las solicitudes");
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error configurando listener:", error);
        toast.error("Error al cargar las solicitudes");
        setLoading(false);
      }
    };

    loadRequests();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      const requestsRef = ref(db, "supportRequests");
      off(requestsRef);
    };
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const result = await AdminSupportRequestController.updateRequestStatus(requestId, newStatus);
      if (result.ok) {
        toast.success("Estado actualizado correctamente");
        loadRequests(); // Recargar las solicitudes
      } else {
        toast.error("Error al actualizar el estado");
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      if (window.confirm("¿Está seguro que desea eliminar esta solicitud?")) {
        const result = await AdminSupportRequestController.deleteRequest(requestId);
        if (result.ok) {
          toast.success("Solicitud eliminada correctamente");
          loadRequests(); // Recargar las solicitudes
        } else {
          toast.error("Error al eliminar la solicitud");
        }
      }
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
      toast.error("Error al eliminar la solicitud");
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Completado":
        return "success";
      case "Cancelado":
        return "danger";
      default:
        return "warning";
    }
  };

  if (loading) {
    return <Container className="py-4">Cargando solicitudes...</Container>;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Solicitudes de Apoyo</h1>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.userName}</td>
              <td>{request.title}</td>
              <td>{request.description}</td>
              <td>{request.date}</td>
              <td>
                <Badge bg={getStatusBadgeVariant(request.status)}>
                  {request.status}
                </Badge>
              </td>
              <td className="d-flex gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" size="sm">
                    Cambiar Estado
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                      onClick={() => handleStatusChange(request.id, "Pendiente")}
                      active={request.status === "Pendiente"}
                    >
                      Pendiente
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => handleStatusChange(request.id, "Completado")}
                      active={request.status === "Completado"}
                    >
                      Completado
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => handleStatusChange(request.id, "Cancelado")}
                      active={request.status === "Cancelado"}
                    >
                      Cancelado
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteRequest(request.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
} 