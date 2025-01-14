"use client";
import { useState, useRef, useEffect } from "react";
import { Overlay, Popover, Badge } from "react-bootstrap";
import { BsBell, BsBellFill } from "react-icons/bs";
import Link from "next/link";
import AuthController from "@/controllers/AuthController";

export default function NotificationsPopover() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [userType, setUserType] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const currentUser = await AuthController.getCurrentUser();
        if (currentUser.role === "Admin") {
          setUserType("admin");
        } else {
          setUserType("user");
        }
      } catch (error) {
        console.error("Error checking user type:", error);
        setUserType("user");
      }
    };
    checkUserType();
  }, []);

  const adminNotifications = [
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
      read: true,
      link: "/admin/actividades",
    }
  ];

  const userNotifications = [
    {
        id: "1",
        title: "Actualización de campaña",
        message: "Nueva campaña de esterilización disponible",
        date: "2024-03-20",
        read: false,
        link: "/campanas"
    },
    {
        id: "2",
        title: "Recordatorio de cita",
        message: "Tu cita de vacunación está programada para mañana a las 10:00 AM",
        date: "2024-02-13T13:20:00Z",
        read: false,
        link: "/appointments"
    },
    {
        id: "3",
        title: "Nueva campaña disponible",
        message: "Se ha publicado una nueva campaña de esterilización en tu zona",
        date: "2024-02-12T10:15:00Z",
        read: true,
        link: "/campaign"
    }
  ];

  const notifications = userType === "admin" ? adminNotifications : userNotifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  const handleNotificationClick = (notification) => {
    // Aquí iría la lógica para marcar como leída
    setShow(false);
  };

  return (
    <div ref={ref}>
      <div 
        onClick={handleClick}
        style={{ cursor: "pointer" }}
        className="d-flex align-items-center"
      >
        {unreadCount > 0 ? <BsBellFill size={20} /> : <BsBell size={20} />}
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute translate-middle rounded-pill"
            style={{ fontSize: "0.6rem", transform: "translate(0, -50%)" }}
          >
            {unreadCount}
          </Badge>
        )}
      </div>

      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref}
        containerPadding={20}
      >
        <Popover id="notifications-popover">
          <Popover.Header>
            <div className="d-flex justify-content-between align-items-center">
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <Badge bg="danger" pill>
                  {unreadCount} nueva{unreadCount !== 1 && "s"}
                </Badge>
              )}
            </div>
          </Popover.Header>
          <Popover.Body>
            {notifications.length > 0 ? (
              <>
                {notifications.map(notification => (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => handleNotificationClick(notification)}
                    className="text-decoration-none"
                  >
                    <div className={`notification-item mb-2 p-2 rounded ${!notification.read ? "bg-light" : ""}`}>
                      <div className="d-flex justify-content-between">
                        <strong className="text-dark">{notification.title}</strong>
                        {!notification.read && (
                          <Badge bg="primary" pill>Nueva</Badge>
                        )}
                      </div>
                      <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                        {notification.message}
                      </p>
                      <small className="text-muted">
                        {new Date(notification.date).toLocaleDateString()}
                      </small>
                    </div>
                  </Link>
                ))}
                <div className="text-center mt-2">
                  <Link
                    href={userType === "admin" ? "/admin/notificaciones" : "/notificaciones"}
                    onClick={() => setShow(false)}
                    className="text-decoration-none"
                  >
                    Ver todas
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-center mb-0">No hay notificaciones</p>
            )}
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
} 