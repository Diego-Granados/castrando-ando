"use client";
import { Card, Row, Col } from "react-bootstrap";

export default function ActivityPetSelector({ pets, selectedPets = [], onPetSelect }) {
  // Helper function to check if a pet is selected
  const isPetSelected = (petId) => {
    return selectedPets.some(pet => pet.id === petId);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title className="fw-semibold fs-5 mb-3">
          Seleccionar mascotas para la actividad
        </Card.Title>
        <div className="text-muted mb-3 small">
          Haz clic en las mascotas que participarán en la actividad
        </div>
        <Row xs={1} md={2} className="g-3">
          {Object.entries(pets).map(([id, pet]) => (
            <Col key={id}>
              <div
                onClick={() => onPetSelect(id, {
                  nombre: pet.nombre,
                  especie: pet.especie,
                  sexo: pet.sexo
                })}
                className="position-relative"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <div
                  style={{ 
                    border: isPetSelected(id) ? '3px solid #0d6efd' : '3px solid transparent',
                    borderRadius: '0.375rem',
                    transform: isPetSelected(id) ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{pet.nombre}</h6>
                      <div className="text-muted small">
                        {pet.especie} • {pet.sexo}
                      </div>
                    </div>
                    {isPetSelected(id) && (
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: '25px',
                          height: '25px',
                          backgroundColor: '#0d6efd',
                          borderRadius: '50%',
                          color: 'white',
                          fontSize: '14px'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        {selectedPets.length > 0 && (
          <div className="mt-3">
            <h6>Mascotas seleccionadas:</h6>
            <ul className="list-unstyled">
              {selectedPets.map(pet => (
                <li key={pet.id} className="d-flex align-items-center mb-2">
                  <span className="me-2">• {pet.nombre}</span>
                  <small className="text-muted">({pet.especie} • {pet.sexo})</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}