"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Badge, Form } from "react-bootstrap";

export default function AdminUsuarios() {
  const [activities, setActivities] = useState([]);
  const [ranking, setRanking] = useState([]);
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Simular carga de datos
    const sampleActivities = [
      {
        id: 1,
        tipo: "CAMPAIGN_SIGNUP",
        descripcion: "Se registró en la campaña 'Esterilización Gratuita'",
        usuario: "María González",
        puntos: 10,
        fecha: "2024-03-20T10:30:00"
      },
      {
        id: 2,
        tipo: "FORUM_POST",
        descripcion: "Creó una publicación en el foro: 'Consejos para cuidar a tu mascota'",
        usuario: "Juan Pérez",
        puntos: 2,
        fecha: "2024-03-20T11:15:00"
      },
      {
        id: 3,
        tipo: "BLOG_POST",
        descripcion: "Publicó un blog: 'La importancia de la esterilización'",
        usuario: "Ana Rodríguez",
        puntos: 5,
        fecha: "2024-03-19T15:20:00"
      },
      {
        id: 4,
        tipo: "CAMPAIGN_SIGNUP",
        descripcion: "Se registró en la campaña 'Vacunación Canina'",
        usuario: "Carlos Mora",
        puntos: 10,
        fecha: "2024-03-18T09:30:00"
      },
      {
        id: 5,
        tipo: "FORUM_POST",
        descripcion: "Creó una publicación en el foro: 'Adopción responsable'",
        usuario: "María González",
        puntos: 2,
        fecha: "2024-03-17T14:45:00"
      }
    ];

    const sampleRanking = [
      { id: 1, nombre: "María González", puntos: 45 },
      { id: 2, nombre: "Juan Pérez", puntos: 38 },
      { id: 3, nombre: "Ana Rodríguez", puntos: 32 },
      { id: 4, nombre: "Carlos Mora", puntos: 28 },
      { id: 5, nombre: "Laura Jiménez", puntos: 25 },
      { id: 6, nombre: "Pedro Vargas", puntos: 22 },
      { id: 7, nombre: "Sofía Castro", puntos: 20 },
      { id: 8, nombre: "Diego Sánchez", puntos: 18 },
      { id: 9, nombre: "Carmen Núñez", puntos: 15 },
      { id: 10, nombre: "Roberto Chaves", puntos: 12 }
    ];
    
    setActivities(sampleActivities);
    setRanking(sampleRanking);
    setLoading(false);
  };

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
    const matchesTipo = !appliedFilters.tipo || activity.tipo === appliedFilters.tipo;
    const matchesUsuario = !appliedFilters.usuario || 
      activity.usuario.toLowerCase().includes(appliedFilters.usuario.toLowerCase());
    const activityDate = new Date(activity.fecha);
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
      case "FORUM_POST":
        return "💬";
      case "BLOG_POST":
        return "✍️";
      default:
        return "📝";
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
                      <option value="CAMPAIGN_SIGNUP">Registro en campaña</option>
                      <option value="FORUM_POST">Publicación en foro</option>
                      <option value="BLOG_POST">Publicación en blog</option>
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
                    {getActivityIcon(activity.tipo)} {activity.tipo}
                  </td>
                  <td>{activity.descripcion}</td>
                  <td>{activity.usuario}</td>
                  <td>+{activity.puntos}</td>
                  <td>{new Date(activity.fecha).toLocaleString()}</td>
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
                    <tr key={user.id}>
                      <td>
                        {index < 3 ? (
                          <span style={{ fontSize: "1.2em" }}>
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td>{user.nombre}</td>
                      <td>{user.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 