"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Badge, Form } from "react-bootstrap";
import UserActivityController from "@/controllers/UserActivityController";
import UserActivity from "@/models/UserActivity";

export default function AdminUsuarios() {
  const [activities, setActivities] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tipo: "",
    usuario: "",
    fechaInicio: "",
    fechaFin: ""
  });
  const [appliedFilters, setAppliedFilters] = useState({
    tipo: "",
    usuario: "",
    fechaInicio: "",
    fechaFin: ""
  });

  const ACTIVITY_TYPES = {
    CAMPAIGN_SIGNUP: "Inscripción a campaña",
    LOST_PET_POST: "Publicación mascota perdida",
    ADOPTION_POST: "Publicación adopción",
    ACTIVITY_SIGNUP: "Inscripción a actividad",
    CAMPAIGN_COMMENT: "Comentario en campaña",
    ACTIVITY_COMMENT: "Comentario en actividad",
    LOST_PET_COMMENT: "Comentario en mascota perdida",
    FORUM_POST: "Mensaje en foro",
    BLOG_COMMENT: "Comentario en blog"
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load all activities
        await UserActivityController.getAllActivities((activitiesData) => {
          const activitiesArray = Object.entries(activitiesData).map(([id, activity]) => ({
            id,
            ...activity
          }));
          setActivities(activitiesArray);
        });

        // Get top 10 users
        const top10 = await UserActivityController.getTop10Users();
        setRanking(top10);

      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      tipo: "",
      usuario: "",
      fechaInicio: "",
      fechaFin: ""
    });
    setAppliedFilters({
      tipo: "",
      usuario: "",
      fechaInicio: "",
      fechaFin: ""
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({...filters});
  };

  const filteredActivities = activities.filter(activity => {
    if (!activity.enabled) return false;
    
    const matchesTipo = !appliedFilters.tipo || activity.type === appliedFilters.tipo;
    
    // Modified user filter to check both name and email
    const matchesUsuario = !appliedFilters.usuario || 
      (activity.userName && activity.userName.toLowerCase().includes(appliedFilters.usuario.toLowerCase())) ||
      (activity.userEmail && activity.userEmail.toLowerCase().includes(appliedFilters.usuario.toLowerCase()));
    
    const activityDate = new Date(activity.timestamp);
    const matchesFechaInicio = !appliedFilters.fechaInicio || 
      activityDate >= new Date(appliedFilters.fechaInicio);
    const matchesFechaFin = !appliedFilters.fechaFin || 
      activityDate <= new Date(appliedFilters.fechaFin + "T23:59:59");

    return matchesTipo && matchesUsuario && matchesFechaInicio && matchesFechaFin;
  });

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case "CAMPAIGN_SIGNUP":
        return "🎯";
      case "ADOPTION_POST":
        return "🐾";
      case "LOST_PET_POST":
        return "🔍";
      case "ACTIVITY_SIGNUP":
        return "📅";
      case "CAMPAIGN_COMMENT":
        return "💬";
      case "LOST_PET_COMMENT":
        return "💬";
      case "FORUM_POST":
        return "📝";
      case "BLOG_COMMENT":
        return "✍️";
      case "ACTIVITY_COMMENT":
        return "💬";
      default:
        return "📌";
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
          Actividad de Usuarios
        </h1>
        <p className="text-center">Cargando datos...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <h2 className="mb-4" style={{ color: "#2055A5" }}>Registro de Actividades</h2>

          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de actividad</Form.Label>
                    <Form.Select
                      name="tipo"
                      value={filters.tipo}
                      onChange={handleFilterChange}
                    >
                      <option value="">Todos</option>
                      <option value="CAMPAIGN_SIGNUP">Inscripción a campaña (+10)</option>
                      <option value="LOST_PET_POST">Publicación mascota perdida (+10)</option>
                      <option value="ADOPTION_POST">Publicación adopción (+8)</option>
                      <option value="ACTIVITY_SIGNUP">Inscripción a actividad (+6)</option>
                      <option value="CAMPAIGN_COMMENT">Comentario en campaña (+2)</option>
                      <option value="ACTIVITY_COMMENT">Comentario en actividad (+2)</option>
                      <option value="LOST_PET_COMMENT">Comentario en mascota perdida (+2)</option>
                      <option value="FORUM_POST">Mensaje en foro (+2)</option>
                      <option value="BLOG_COMMENT">Comentario en blog (+2)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Buscar usuario..."
                      name="usuario"
                      value={filters.usuario}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha inicio</Form.Label>
                    <Form.Control
                      type="date"
                      name="fechaInicio"
                      value={filters.fechaInicio}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha fin</Form.Label>
                    <Form.Control
                      type="date"
                      name="fechaFin"
                      value={filters.fechaFin}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={handleResetFilters}
                  className="rounded-pill"
                >
                  Limpiar filtros
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApplyFilters}
                  className="rounded-pill"
                >
                  Aplicar filtros
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Usuario</th>
                <th>Puntos</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map(activity => (
                <tr key={activity.id}>
                  <td>
                    {getActivityIcon(activity.type)} {ACTIVITY_TYPES[activity.type] || activity.type}
                  </td>
                  <td>{activity.description}</td>
                  <td>
                    <div>{activity.userName || 'N/A'}</div>
                    <small className="text-muted">{activity.userEmail || activity.userId}</small>
                  </td>
                  <td>+{activity.points}</td>
                  <td>{new Date(activity.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No se encontraron actividades con los filtros seleccionados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Top 10 Usuarios del Mes</h3>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Usuario</th>
                    <th>Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((user, index) => (
                    <tr key={user.userId}>
                      <td>
                        {index < 3 ? (
                          <span style={{ fontSize: "1.2em" }}>
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td>
                        <div>{user.nombre}</div>
                        <small className="text-muted">{user.email}</small>
                      </td>
                      <td>
                        <Badge bg="primary" pill>
                          {user.puntos}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {ranking.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No hay actividades este mes
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 