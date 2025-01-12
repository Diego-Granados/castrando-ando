"use client";

import { Form, Card } from "react-bootstrap";

export default function NewsletterForm() {
  return (
    <Card className="mb-4">
      <Card.Body className="p-5">
        <div className="text-left mb-4">
          <h2>Suscríbase a nuestro boletín</h2>
          <p className="text-muted">
            Reciba actualizaciones sobre nuestras campañas y noticias
            importantes.
          </p>
        </div>
        <Form style={{ maxWidth: "500px" }}>
          <Form.Group className="mb-3" controlId="newsletterEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo electrónico"
              name="newsletterEmail"
              required
            />
            <Form.Text className="text-muted">
              No compartiremos su correo electrónico con nadie más.
            </Form.Text>
          </Form.Group>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Suscribirse
            </button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
