"use client";
import { Form } from "react-bootstrap";
export default function Reservaciones() {
  return (
    <main className="container">
      <h1>Reservaciones</h1>
      <p>Ingrese su número cédula.</p>
      <Form>
        <Form.Group className="mb-3" controlId="inputTelefono">
          <Form.Label className="fw-semibold fs-5">Teléfono</Form.Label>
          <Form.Control
            type="number"
            placeholder="Teléfono"
            name="phone"
            required
          />
        </Form.Group>
      </Form>
    </main>
  );
}
