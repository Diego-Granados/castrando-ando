"use client";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ButtonGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { BsTrash } from 'react-icons/bs';
import NotificationController from "@/controllers/NotificationController";
import { toast } from "react-toastify";

export default function AdminNotificaciones() {
  const [notifications, setNotifications] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const unsubscribe = await NotificationController.getAdminNotifications(setNotifications);
        return () => unsubscribe();
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
        toast.error("Error al cargar las notificaciones");
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const handleNotificationClick = async (notification, e) => {
    if (e.target.closest('.delete-button')) return;
    
    try {
      await NotificationController.markAdminNotificationAsRead(notification.id);
      if (notification.link) {
        router.push(notification.link);
      }
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
      toast.error("Error al marcar la notificación como leída");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationController.markAllAdminNotificationsAsRead();
      toast.success("Todas las notificaciones han sido marcadas como leídas");
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
      toast.error("Error al marcar todas las notificaciones como leídas");
    }
  };

  const handleDeleteNotification = async (notification, e) => {
    e.stopPropagation();
    try {
      await NotificationController.deleteAdminNotification(notification.id);
      toast.success("Notificación eliminada");
    } catch (error) {
      console.error("Error al eliminar la notificación:", error);
      toast.error("Error al eliminar la notificación");
    }
  };

  const getNotificationIcon = (title) => {
    if (title.toLowerCase().includes('adopción')) return "❤️";
    if (title.toLowerCase().includes('mascota')) return "🐾";
    if (title.toLowerCase().includes('campaña')) return "📅";
    if (title.toLowerCase().includes('cita')) return "📌";
    if (title.toLowerCase().includes('rifa')) return "🎫";
    return "📢";
  };

  // Convert notifications object to array and sort by date
  const notificationsArray = Object.values(notifications).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredNotifications = notificationsArray.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const unreadCount = notificationsArray.filter(n => !n.read).length;
  const readCount = notificationsArray.filter(n => n.read).length;

  if (loading) {
    return <div className="text-center mt-5">Cargando notificaciones...</div>;
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4" style={{ color: "#2055A5" }}>
        Buzón de Notificaciones Administrativas
      </h1>

      <Row className="justify-content-between align-items-center mb-4">
        <Col xs="auto">
          <ButtonGroup>
            <Button
              variant={filter === "all" ? "primary" : "outline-primary"}
              onClick={() => setFilter("all")}
            >
              Todas ({notificationsArray.length})
            </Button>
            <Button
              variant={filter === "unread" ? "primary" : "outline-primary"}
              onClick={() => setFilter("unread")}
            >
              No leídas ({unreadCount})
            </Button>
            <Button
              variant={filter === "read" ? "primary" : "outline-primary"}
              onClick={() => setFilter("read")}
            >
              Leídas ({readCount})
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
                      <span className="me-2 fs-4">
                        {getNotificationIcon(notification.title)}
                      </span>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <Card.Title className="mb-0">
                            {notification.title}
                          </Card.Title>
                          {!notification.read && (
                            <span className="badge bg-primary rounded-pill">
                              Nueva
                            </span>
                          )}
                        </div>
                        <Card.Text className="mt-1">
                          {notification.message}
                        </Card.Text>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <Button
                        variant="link"
                        className="delete-button p-0 mb-2"
                        onClick={(e) => handleDeleteNotification(notification, e)}
                      >
                        <BsTrash className="text-danger" />
                      </Button>
                      <small className="text-muted d-block">
                        {new Date(notification.date).toLocaleDateString()}
                      </small>
                      <small className="text-muted d-block">
                        {new Date(notification.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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