import { Col, Form, Row } from "react-bootstrap";

export default function Price({ id, price, weight }) {
  return (
    <Row>
      <Col xs={12} lg={6} className="mb-3 mb-lg-0">
        <Form.Group
          controlId={`price${id}`}
          as={Row}
          className="align-items-center"
        >
          <Form.Label column sm={2}>
            Precio:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              name="price"
              type="number"
              placeholder="Precio para categoría"
              defaultValue={price}
              required
            />
          </Col>
        </Form.Group>
      </Col>
      <Col xs={12} lg={6}>
        <Form.Group
          controlId={`weight${id}`}
          as={Row}
          className="align-items-center"
        >
          <Form.Label column sm={3}>
            Peso en kg o descripción (ej: gatos):
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              name="weight"
              placeholder="Peso de animal"
              defaultValue={weight}
              required
            />
          </Col>
        </Form.Group>
      </Col>
    </Row>
  );
}
