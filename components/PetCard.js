"use client";
import { Card, Image, Row, Col } from "react-bootstrap";

export default function PetCard({ pet }) {
  return (
    <Card className="h-100">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={4} className="text-center">
            {pet.imageUrl ? (
              <Image
                src={pet.imageUrl}
                alt={`Foto de ${pet.name}`}
                style={{ 
                  height: "100px", 
                  width: "100px",
                  objectFit: "cover",
                  borderRadius: "50%" 
                }}
              />
            ) : (
              <div 
                className="bg-secondary d-flex align-items-center justify-content-center"
                style={{
                  height: "100px",
                  width: "100px",
                  borderRadius: "50%"
                }}
              >
                <span className="text-white">Sin foto</span>
              </div>
            )}
          </Col>
          <Col xs={8}>
            <Card.Title>{pet.name}</Card.Title>
            <Card.Text>
              <strong>Especie:</strong> {pet.animal ? "Perro" : "Gato"}
              <br />
              <strong>Sexo:</strong> {pet.sex ? "Macho" : "Hembra"}
              <br />
              <strong>Peso:</strong> {pet.weight} kg
              <br />
              <strong>Condición especial:</strong>{" "}
              {pet.hasSpecialCondition ? "Sí" : "No"}
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
