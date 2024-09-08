"use client";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function CreateForm() {
  return (
    <Container>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="startDate">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                placeholder="Seleccione la fecha de inicio"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="endDate">
              <Form.Label>Fecha de Fin</Form.Label>
              <Form.Control
                type="date"
                placeholder="Seleccione la fecha de fin"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="location">
          <Form.Label>Ubicación</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la ubicación del evento"
          />
        </Form.Group>

        <Form.Group controlId="requirements">
          <Form.Label>Requisitos</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Indique los requisitos para la campaña"
          />
        </Form.Group>

        <Form.Group controlId="contactNumber">
          <Form.Label>Número de Contacto</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Ingrese el número de contacto"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </Container>
  );
}

export default CreateForm;
