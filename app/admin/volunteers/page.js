"use client";

import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Alert } from "react-bootstrap";
import { Pencil, Trash2 } from "lucide-react";
import VolunteerController from "@/controllers/VolunteerController";
import styles from "./VolunteersPage.module.css";

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        await VolunteerController.getVolunteers(setVolunteers);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };
    fetchVolunteers();
  }, []);

  const handleEdit = (volunteer) => {
    setId(volunteer.id);
    setName(volunteer.name);
    setEmail(volunteer.email);
    setPhone(volunteer.phone);
    setComment(volunteer.comment);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta solicitud?"
    );
    if (confirmDelete) {
      try {
        await VolunteerController.deleteVolunteer(id);
        setVolunteers(volunteers.filter((volunteer) => volunteer.id !== id));
      } catch (error) {
        console.error("Error deleting volunteer:", error);
      }
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const updatedVolunteer = { id, name, email, phone, comment };
    try {
      await VolunteerController.updateVolunteer(id, updatedVolunteer);
      setVolunteers(
        volunteers.map((volunteer) =>
          volunteer.id === id ? updatedVolunteer : volunteer
        )
      );
      setShowModal(false);
      setIsEditing(false);
    } catch (error) {
      setModalError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Voluntarios</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Comentario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((volunteer) => (
            <tr key={volunteer.id}>
              <td>{volunteer.name}</td>
              <td>{volunteer.id}</td>
              <td>{volunteer.email}</td>
              <td>{volunteer.phone}</td>
              <td>{volunteer.comment}</td>
              <td>
                <Button
                  variant="outline-primary"
                  className={styles.btn}
                  onClick={() => handleEdit(volunteer)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="outline-danger"
                  className={styles.btn}
                  onClick={() => handleDelete(volunteer.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Voluntario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleModalSubmit}>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Teléfono
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">
                Comentario
              </label>
              <textarea
                className="form-control"
                id="comment"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            <Button type="submit" variant="primary">
              Guardar cambios
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VolunteersPage;
