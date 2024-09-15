import { Col, Form, Row } from "react-bootstrap";

export default function Price({ id, price, weight }) {
  return (
    <Row>
      <Col>
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
      <Col>
        <Form.Group
          controlId={`weight${id}`}
          as={Row}
          className="align-items-center"
        >
          <Form.Label column sm={3}>
            Hasta (kg):
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              name="weight"
              type="number"
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
