"use client";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";

function Price({ key, price, weight }) {
  return (
    <Row>
      <Col>
        <Form.Group
          controlId={`price${key}`}
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
              placeholder="Price para categoría"
              defaultValue={price}
            />
          </Col>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group
          controlId={`weight${key}`}
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
            />
          </Col>
        </Form.Group>
      </Col>
    </Row>
  );
}

function Requirement({ key }) {
  return (
    <Row>
      <Col>
        <ul className="d-flex align-items-center">
          <li className="me-2"></li>
          <Form.Control name="requirement" placeholder="Requisito" />
        </ul>
      </Col>
    </Row>
  );
}
function CreateForm() {
  const today = new Date().toISOString().split("T")[0];

  const [prices, setPrices] = useState([
    <Price key={0} price={13000} weight={10} />,
    <Price key={1} price={16000} weight={15} />,
    <Price key={2} price={22000} weight={20} />,
    <Price key={3} price={26000} weight={100} />,
  ]);

  const [reqs, setReqs] = useState([<Requirement key={0} />]);

  function addPrices() {
    setPrices(prices.concat(<Price key={prices.length} />));
  }

  function deletePrices() {
    setPrices(prices.slice(0, -1));
  }

  function addReq() {
    setReqs(reqs.concat(<Requirement key={reqs.length} />));
  }

  function deleteReq() {
    setReqs(reqs.slice(0, -1));
  }
  return (
    <Container>
      <Form>
        <Form.Group controlId="title">
          <Form.Label className="fw-semibold">Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el título de la campaña"
            name="title"
          />
        </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="startDate">
              <Form.Label className="fw-semibold">Fecha de inicio</Form.Label>
              <Form.Control
                type="date"
                placeholder="Seleccione la fecha de inicio"
                defaultValue={today}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="endDate">
              <Form.Label className="fw-semibold">Fecha de fin</Form.Label>
              <Form.Control
                type="date"
                placeholder="Seleccione la fecha de fin"
                defaultValue={today}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="location">
          <Form.Label className="fw-semibold">Ubicación</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la ubicación del evento"
          />
        </Form.Group>

        <Form.Group controlId="requirements">
          <Form.Label className="fw-semibold">Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Indique los requisitos para la campaña"
          />
        </Form.Group>
        <Form.Label className="fw-semibold">Precios:</Form.Label>
        {prices}
        <div className="container">
          {prices.length < 5 && (
            <button
              className="active:opacity-55 btn"
              onClick={() => addPrices()}
              type="button"
              aria-label="Agregar precio"
            >
              <CirclePlus size="40px" />
            </button>
          )}
          {prices.length > 1 && (
            <button
              className="active:opacity-55 btn"
              onClick={() => deletePrices()}
              type="button"
              aria-label="Eliminar precio"
            >
              <CircleMinus size="40px" />
            </button>
          )}
        </div>
        <Form.Label className="fw-semibold">Requisitos:</Form.Label>
        {reqs}
        <div className="container">
          {reqs.length < 5 && (
            <button
              className="active:opacity-55 btn"
              onClick={() => addReq()}
              type="button"
              aria-label="Agregar precio"
            >
              <CirclePlus size="40px" />
            </button>
          )}
          {reqs.length > 1 && (
            <button
              className="active:opacity-55 btn"
              onClick={() => deleteReq()}
              type="button"
              aria-label="Eliminar precio"
            >
              <CircleMinus size="40px" />
            </button>
          )}
        </div>
        <Form.Group controlId="contactNumber">
          <Form.Label className="fw-semibold">Número de Contacto</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Ingrese el número de contacto"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Enviar
        </Button>
      </Form>
    </Container>
  );
}

export default CreateForm;
