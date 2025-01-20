"use client";
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

export default function NotLoggedRegister({ show, onHide, onRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    cedula: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Basic validation
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Por favor ingrese un correo electrónico válido');
      }
      
      if (!formData.cedula.match(/^\d{9,10}$/)) {
        throw new Error('La cédula debe tener 9 o 10 dígitos');
      }

      // Pass the form data to parent component
      await onRegister?.(formData);
      
      // Show success message
      setSuccess('¡Registro exitoso! Te hemos enviado un correo con los detalles.');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onHide();
        setSuccess('');
        setFormData({ email: '', cedula: '' });
      }, 2000);

    } catch (error) {
      setError(error.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registro para participar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          Para participar en esta actividad, por favor ingresa tu correo y cédula
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@correo.com"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              required
              placeholder="Ingresa tu número de cédula"
              pattern="\d{9,10}"
              maxLength={10}
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Ingresa tu número de cédula sin guiones ni espacios
            </Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarme'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
