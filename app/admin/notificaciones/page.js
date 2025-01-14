"use client";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Badge } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { BsTrash } from 'react-icons/bs';

export default function AdminNotificaciones() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const sampleNotifications = [
    {
      id: "1",
      title: "Actividad: Campaña de esterilización",
      message: "La campaña de esterilización está activa y tiene cupos disponibles",
      date: "2024-02-18T15:45:00Z",
      read: false,
      link: "/admin/actividades",
    },
    {
      id: "2",
      title: "Actividad: Feria de adopción",
      message: "La feria de adopción ha finalizado",
      date: "2024-02-17T09:15:00Z",
      read: true,
      link: "/admin/actividades",
    },
    {
      id: "3",
      title: "Actividad: Taller de primeros auxilios",
      message: "El taller de primeros auxilios no tiene cupos disponibles",
      date: "2024-02-16T14:20:00Z",
      read: false,
      link: "/admin/actividades",
    }
  ];

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setNotifications(sampleNotifications);
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const handleNotificationClick = async (notification, e) => {
    if (e.target.closest('.delete-button')) return;
    router.push(notification.link);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n => ({ ...n, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId, e) => {
    e.stopPropagation();
    setNotifications(prevNotifications =>
      prevNotifications.filter(n => n.id !== notificationId)
    );
  };

  const getNotificationIcon = (title) => {
    if (title.toLowerCase().includes('adopción')) return "❤️";
    if (title.toLowerCase().includes('actividad')) return "📅";
    if (title.toLowerCase().includes('mascota')) return "🐾";
    if (title.toLowerCase().includes('reporte')) return "⚠️";
    return "📢";
  };


  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  if (loading) {
    return <div className="text-center mt-5">Cargando notificaciones...</div>;
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Buzón de Notificaciones
      </h1>

      <Row className="justify-content-between align-items-center mb-4">
        <Col xs="auto">
          <ButtonGroup>
            <Button
              variant={filter === "all" ? "primary" : "outline-primary"}
              onClick={() => setFilter("all")}
            >
              Todas ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "primary" : "outline-primary"}
              onClick={() => setFilter("unread")}
            >
              No leídas ({notifications.filter(n => !n.read).length})
            </Button>
            <Button
              variant={filter === "read" ? "primary" : "outline-primary"}
              onClick={() => setFilter("read")}
            >
              Leídas ({notifications.filter(n => n.read).length})
            </Button>
          </ButtonGroup>
        </Col>
        <Col xs="auto">
          <Button
            variant="link"
            onClick={handleMarkAllAsRead}
            className="text-decoration-none"
          >
            Marcar todas como leídas
          </Button>
        </Col>
      </Row>

      {filteredNotifications.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h3>No hay notificaciones</h3>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredNotifications.map((notification) => (
            <Col key={notification.id} xs={12} className="mb-3">
              <Card
                className={`cursor-pointer ${!notification.read ? 'border-primary' : ''}`}
                style={{ cursor: "pointer" }}
                onClick={(e) => handleNotificationClick(notification, e)}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center flex-grow-1">
                      <span className="me-2 fs-4">{getNotificationIcon(notification.title)}</span>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <Card.Title className="mb-0">
                            {notification.title}
                          </Card.Title>
                          {!notification.read && (
                            <span className="badge bg-primary rounded-pill">Nueva</span>
                          )}
                        </div>
                        <Card.Text className="mt-1">{notification.message}</Card.Text>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <Button
                        variant="link"
                        className="delete-button p-0 mb-2"
                        onClick={(e) => handleDeleteNotification(notification.id, e)}
                      >
                        <BsTrash className="text-danger" />
                      </Button>
                      <small className="text-muted d-block">
                        {new Date(notification.date).toLocaleDateString()}
                      </small>
                      <small className="text-muted d-block">
                        {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
} 