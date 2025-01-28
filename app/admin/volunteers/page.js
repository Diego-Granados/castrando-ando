"use client";

import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Alert } from "react-bootstrap";
import { MedalIcon, Pencil, Receipt, Trash2 } from "lucide-react";
import VolunteerController from "@/controllers/VolunteerController";
import { sendCertificateEmail } from "@/controllers/EmailSenderController";
import styles from "./VolunteersPage.module.css";
import { Check, StarBorder } from "@mui/icons-material";
import { toast } from "react-toastify";

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

  const handleGenerateCertificate = async (volunteer) => {
    try {
      const response = await fetch("/api/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: volunteer.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Error generating certificate");
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link for local save
      const url = window.URL.createObjectURL(blob);
      const dateForFilename = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).replace(/\//g, '-');
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificado-${volunteer.name.replace(/\s+/g, "-")}-${dateForFilename}.jpg`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Convert blob to buffer for email sending
      const arrayBuffer = await blob.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString('base64');

      // Send certificate via email directly using EmailSenderController
      const emailResponse = await sendCertificateEmail(
        volunteer.email,
        volunteer.name,
        base64String
      );

      if (!emailResponse.ok) {
        throw new Error("Error sending certificate email");
      }

      toast.success("Certificado generado y enviado exitosamente");
    } catch (error) {
      console.error("Error handling certificate:", error);
      toast.error("Error al procesar el certificado");
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
      <div className={styles.header}>
        <h1>Gestión de Voluntarios</h1>
        <p className={styles.subtitle}>
          Administra las solicitudes de voluntariado
        </p>
      </div>

      <div className={styles.info}>
        <p>Los certificados se descargarán a su computadora y serán enviados al correo del voluntario también.</p>
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
                    onClick={() => handleGenerateCertificate(volunteer)}
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
