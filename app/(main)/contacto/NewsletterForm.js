"use client";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import NewsletterController from "@/controllers/NewsletterController";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberId, setSubscriberId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Por favor ingrese un correo electrónico");
      return;
    }

    setLoading(true);
    try {
      // Check if email exists first
      const subscribers = await NewsletterController.getAllSubscribers();
      const existingSubscriber = subscribers.find(
        (s) => s.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (existingSubscriber) {
        setIsSubscribed(true);
        setSubscriberId(existingSubscriber.id);
        setEmail(existingSubscriber.email);
        toast.info("Este correo ya está suscrito a nuestro boletín");
        setLoading(false);
        return;
      }

      // If email doesn't exist, create new subscription
      const newSubscriber = await NewsletterController.addSubscriber({
        email: email.trim(),
        subscribedAt: new Date().toISOString()
      });
      
      toast.success("¡Gracias por suscribirse a nuestro boletín!");
      setIsSubscribed(true);
      setSubscriberId(newSubscriber.id);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Error al suscribirse al boletín");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!subscriberId) return;

    setLoading(true);
    try {
      await NewsletterController.deleteSubscriber(subscriberId);
      
      toast.success("Se ha cancelado su suscripción");
      setIsSubscribed(false);
      setSubscriberId(null);
      setEmail("");
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      toast.error("Error al cancelar la suscripción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h3>Boletín Informativo</h3>
      <p className="text-muted">
        Reciba actualizaciones sobre nuestras campañas y actividades. Si ya está suscrito y desea cancelar su suscripción al boletín, puede volver a escribir su correo electrónico y presionar "Subscribirse" para que se le brinde la opción de cancelar.
      </p>

      {isSubscribed ? (
        <div>
          <Alert variant="info">
            Este correo ya está suscrito a nuestro boletín.
          </Alert>
          <Button 
            variant="danger" 
            onClick={handleUnsubscribe}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Cancelar suscripción"}
          </Button>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
          >
            {loading ? "Suscribiendo..." : "Suscribirse"}
          </Button>
        </Form>
      )}
    </div>
  );
}
