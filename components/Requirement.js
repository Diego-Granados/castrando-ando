import { Col, Form, Row } from "react-bootstrap";

export default function Requirement({ defaultRequirement }) {
  return (
    <Row>
      <Col>
        <ul className="d-flex align-items-center">
          <li className="me-2"></li>
          <Form.Control
            name="requirement"
            placeholder="Requisito"
            defaultValue={defaultRequirement}
            required
          />
        </ul>
      </Col>
    </Row>
  );
}
