"use client";

import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Alert } from "react-bootstrap";
import { MedalIcon, Pencil, Receipt, Trash2 } from "lucide-react";
import VolunteerController from "@/controllers/VolunteerController";
import styles from "./VolunteersPage.module.css";
import { Check, StarBorder } from "@mui/icons-material";

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

  //TODO Implementar la función del boton estrella, que es enviar certificado. esto cuando se acepta la solicitud, agreagar un campo al editar que permita cambiar el estado, este debe ser un dropdown con las opciones, de enviado, confirmado, rechazado.

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
      <div className={styles.header}>
        <h1>Gestión de Voluntarios</h1>
        <p className={styles.subtitle}>
          Administra las solicitudes de voluntariado
        </p>
      </div>

      <div className={styles.tableWrapper}>
        <Table hover className={styles.table}>
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Comentario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td>{volunteer.id}</td>
                <td>{volunteer.name}</td>
                <td>{volunteer.email}</td>
                <td>{volunteer.phone}</td>
                <td className={styles.commentCell}>{volunteer.comment}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      volunteer.status === "sent"
                        ? styles.statusSent
                        : styles.statusPending
                    }`}
                  >
                    {volunteer.status === "sent" ? "Enviado" : "Pendiente"}
                  </span>
                </td>
                <td className={styles.actions}>
                  <Button
                    variant="outline-primary"
                    className={styles.actionButton}
                    onClick={() => handleEdit(volunteer)}
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    className={styles.actionButton}
                    onClick={() => handleDelete(volunteer.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Button
                    variant="outline-success"
                    className={styles.actionButton}
                    onClick={() => handleDelete(volunteer.id)}
                    title="Certificado"
                  >
                    <StarBorder />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>Editar Voluntario</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <form onSubmit={handleModalSubmit}>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="comment">Comentario</label>
              <textarea
                id="comment"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Guardar cambios
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VolunteersPage;
