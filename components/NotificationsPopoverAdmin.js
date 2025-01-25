"use client";
import { useState, useRef, useEffect } from "react";
import { Overlay, Popover, Badge } from "react-bootstrap";
import { BsBell, BsBellFill } from "react-icons/bs";
import Link from "next/link";
import NotificationController from "@/controllers/NotificationController";
import { toast } from "react-toastify";

export default function NotificationsPopoverAdmin() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let unsubscribeNotifications;
    let unsubscribeCount;

    const fetchNotifications = async () => {
      try {
        unsubscribeNotifications = await NotificationController.getNotifications(
          setNotifications,
          5
        );
        unsubscribeCount = await NotificationController.getUnreadCount(setUnreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Error al cargar las notificaciones");
      }
    };

    fetchNotifications();

    return () => {
      if (unsubscribeNotifications) unsubscribeNotifications();
      if (unsubscribeCount) unsubscribeCount();
    };
  }, []);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await NotificationController.markAsRead(notification.id);
      }
      setShow(false);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error al marcar la notificación como leída");
    }
  };

  // Convert notifications object to sorted array
  const sortedNotifications = Object.values(notifications).sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

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
              <span>Notificaciones Admin</span>
              {unreadCount > 0 && (
                <Badge bg="danger" pill>
                  {unreadCount} nueva{unreadCount !== 1 && "s"}
                </Badge>
              )}
            </div>
          </Popover.Header>
          <Popover.Body>
            {sortedNotifications.length > 0 ? (
              <>
                {sortedNotifications.map(notification => (
                  <Link
                    key={notification.id}
                    href={notification.link || "#"}
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
                    href="/admin/notificaciones"
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