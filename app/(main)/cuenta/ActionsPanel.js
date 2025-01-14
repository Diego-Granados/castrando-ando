"use client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Badge, ListGroup } from "react-bootstrap";

export default function ActionsPanel() {
  const [activities, setActivities] = useState([]);
  const [points, setPoints] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sample data for testing
  const sampleActivities = [
    {
      type: "BLOG_POST",
      description: "Publicaste un nuevo artículo: 'Beneficios de la esterilización'",
      timestamp: "2024-02-20T16:30:00Z",
      points: 5,
      metadata: {
        blogTitle: "Beneficios de la esterilización",
        blogId: "blog_1"
      }
    },
    {
      type: "CAMPAIGN_SIGNUP",
      description: "Te uniste a la campaña de esterilización",
      timestamp: "2024-02-19T10:30:00Z",
      points: 10,
      metadata: {
        campaignName: "Campaña de Esterilización Febrero 2024",
        campaignId: "camp_1"
      }
    },
    {
      type: "BLOG_POST",
      description: "Publicaste un nuevo artículo: 'Cuidados básicos para mascotas'",
      timestamp: "2024-02-19T09:15:00Z",
      points: 5,
      metadata: {
        blogTitle: "Cuidados básicos para mascotas",
        blogId: "blog_2"
      }
    },
    {
      type: "FORUM_POST",
      description: "Publicaste en el foro: 'Consejos para cuidar a tu mascota'",
      timestamp: "2024-02-18T15:45:00Z",
      points: 2,
      metadata: {
        forumTitle: "Consejos para cuidar a tu mascota",
        forumId: "forum_1"
      }
    },
    {
      type: "CAMPAIGN_SIGNUP",
      description: "Te uniste a la campaña de vacunación",
      timestamp: "2024-02-17T09:15:00Z",
      points: 10,
      metadata: {
        campaignName: "Campaña de Vacunación 2024",
        campaignId: "camp_2"
      }
    },
    {
      type: "FORUM_POST",
      description: "Publicaste en el foro: 'Experiencias de adopción'",
      timestamp: "2024-02-16T14:20:00Z",
      points: 2,
      metadata: {
        forumTitle: "Experiencias de adopción",
        forumId: "forum_2"
      }
    }
  ];

  useEffect(() => {
    const loadUserActivities = async () => {
      try {
        setActivities(sampleActivities);
        
        // Calculate total points
        const totalPoints = sampleActivities.reduce((sum, activity) => sum + activity.points, 0);
        setPoints(totalPoints);

        // Calculate current month points
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const monthlyPointsTotal = sampleActivities.reduce((sum, activity) => {
          const activityDate = new Date(activity.timestamp);
          if (activityDate.getMonth() === currentMonth && 
              activityDate.getFullYear() === currentYear) {
            return sum + activity.points;
          }
          return sum;
        }, 0);
        
        setMonthlyPoints(monthlyPointsTotal);
      } catch (error) {
        console.error("Error loading user activities:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserActivities();
  }, []);

  function getActivityIcon(type) {
    switch (type) {
      case "CAMPAIGN_SIGNUP":
        return "🎯";
      case "FORUM_POST":
        return "💬";
      case "BLOG_POST":
        return "✍️";
      default:
        return "📝";
    }
  }

  function getPointsDescription(type) {
    switch (type) {
      case "CAMPAIGN_SIGNUP":
        return "+10 puntos por inscripción a campaña";
      case "FORUM_POST":
        return "+2 puntos por mensaje en foro";
      case "BLOG_POST":
        return "+5 puntos por publicación en blog";
      default:
        return "";
    }
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (loading) {
    return (
      <Card className="shadow">
        <Card.Body>
          <h3 className="mb-4">Mis Actividades</h3>
          <p>Cargando actividades...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Mis Actividades</h3>
          <div className="text-end">
            <div className="d-flex gap-3 justify-content-end mb-2">
              <Badge bg="primary" pill className="fs-6">
                {points} puntos totales
              </Badge>
              <Badge bg="success" pill className="fs-6">
                {monthlyPoints} puntos del mes
              </Badge>
            </div>
            <small className="text-muted">
              Ranking mensual de participación
            </small>
          </div>
        </div>

        <Row className="g-4">
          <Col xs={12}>
            <ListGroup variant="flush">
              {activities.length > 0 ? (
                activities.map((activity, index) => {
                  const activityDate = new Date(activity.timestamp);
                  const isCurrentMonth = 
                    activityDate.getMonth() === new Date().getMonth() &&
                    activityDate.getFullYear() === new Date().getFullYear();
                  
                  return (
                    <ListGroup.Item 
                      key={index} 
                      className="py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <span className="me-2 fs-5">{getActivityIcon(activity.type)}</span>
                            <span className="fw-medium">{activity.description}</span>
                          </div>
                          <small className="text-muted d-block">
                            {formatDate(activity.timestamp)}
                          </small>
                          <small className="text-primary">
                            {getPointsDescription(activity.type)}
                          </small>
                        </div>
                        <Badge bg={isCurrentMonth ? "success" : "secondary"} pill className="ms-2">
                          +{activity.points}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <ListGroup.Item className="text-center py-4 text-muted">
                  No hay actividades registradas
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
} 