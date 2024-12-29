"use client";
import { Card, Row, Col } from "react-bootstrap";
import PetCard from "@/components/PetCard";

export default function PetSelector({ pets, selectedPet, onPetSelect }) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title className="fw-semibold fs-5 mb-3">
          Seleccionar mascota registrada
        </Card.Title>
        <Row xs={1} md={2} className="g-3">
          {Object.entries(pets).map(([id, pet]) => (
            <Col key={id}>
              <div
                onClick={() => onPetSelect(id, pet)}
                style={{ 
                  cursor: 'pointer',
                  border: selectedPet?.id === id ? '2px solid #0d6efd' : 'none',
                  borderRadius: '0.375rem'
                }}
              >
                <PetCard pet={{ id, ...pet }} />
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
} 