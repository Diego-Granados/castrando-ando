"use client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Badge, ListGroup } from "react-bootstrap";
import UserActivityController from "@/controllers/UserActivityController";

export default function ActionsPanel() {
  const [activities, setActivities] = useState([]);
  const [points, setPoints] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user activities
        const unsubscribe = await UserActivityController.getUserActivities(setActivities);
        
        // Get total points
        const totalPoints = await UserActivityController.getUserPoints();
        setPoints(totalPoints);

        // Get monthly points
        const monthPoints = await UserActivityController.getMonthlyPoints();
        setMonthlyPoints(monthPoints);

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading user activities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  function getActivityIcon(type) {
    switch (type) {
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
  }

  function getPointsDescription(type) {
    switch (type) {
      case "CAMPAIGN_SIGNUP":
        return "+10 puntos por inscripción a campaña";
      case "LOST_PET_POST":
        return "+10 puntos por publicación de mascota perdida";
      case "ADOPTION_POST":
        return "+8 puntos por publicación de adopción";
      case "ACTIVITY_SIGNUP":
        return "+6 puntos por inscripción a actividad";
      case "CAMPAIGN_COMMENT":
        return "+2 puntos por comentario en campaña";
      case "LOST_PET_COMMENT":
        return "+2 puntos por comentario en publicación de mascota perdida";
      case "FORUM_POST":
        return "+2 puntos por mensaje en foro";
      case "BLOG_COMMENT":
        return "+2 puntos por comentario en blog";
      case "ACTIVITY_COMMENT":
        return "+2 puntos por comentario en actividad";
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