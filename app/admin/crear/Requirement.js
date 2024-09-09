import { Col, Form, Row } from "react-bootstrap";

export default function Requirement({}) {
  return (
    <Row>
      <Col>
        <ul className="d-flex align-items-center">
          <li className="me-2"></li>
          <Form.Control name="requirement" placeholder="Requisito" required />
        </ul>
      </Col>
    </Row>
  );
}
