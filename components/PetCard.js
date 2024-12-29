"use client";
import { Card, Image, Row, Col } from "react-bootstrap";

export default function PetCard({ pet }) {
  return (
    <Card className="h-100">
      <Card.Body>
        <Row className="align-items-center g-3">
          <Col xs={3} className="text-center">
            <div style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
              {pet.imageUrl ? (
                <Image
                  src={pet.imageUrl}
                  alt={`Foto de ${pet.name}`}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <div 
                  className="bg-secondary d-flex align-items-center justify-content-center"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: "50%",
                  }}
                >
                  <span className="text-white small">Sin foto</span>
                </div>
              )}
            </div>
          </Col>
          <Col xs={9}>
            <Card.Title className="text-break h5 mb-2">{pet.name}</Card.Title>
            <Card.Text className="text-break mb-0 small">
              <strong>Especie:</strong> {pet.animal ? "Perro" : "Gato"}
              <br />
              <strong>Sexo:</strong> {pet.sex ? "Macho" : "Hembra"}
              <br />
              <strong>Peso:</strong> {pet.weight} kg
              <br />
              <strong>Condición especial:</strong>{" "}
              {pet.priceSpecial ? "Sí" : "No"}
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
