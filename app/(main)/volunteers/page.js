"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import VolunteerController from "@/controllers/VolunteerController";
import styles from "./VolunteersPage.module.css";
import { toast } from "react-toastify";

const VolunteersPage = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (modalError) {
      const timer = setTimeout(() => {
        setModalError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modalError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id.length !== 9) {
      setError("La cédula debe tener 9 dígitos.");
      return;
    }
    const newVolunteer = { id, name, email, phone, comment };
    try {
      if (isEditing) {
        await VolunteerController.updateVolunteer(id, newVolunteer);
      } else {
        const result = await VolunteerController.createVolunteer(newVolunteer);
        toast.success(result.message);
      }
      setId("");
      setName("");
      setEmail("");
      setPhone("");
      setComment("");
      setSubmitted(true);
      setError("");
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (id.length !== 9) {
      setModalError("La cédula debe tener 9 dígitos.");
      return;
    }
    try {
      const volunteerData = await VolunteerController.getVolunteerById(id);
      setName(volunteerData.name);
      setEmail(volunteerData.email);
      setPhone(volunteerData.phone);
      setComment(volunteerData.comment);
      setModalError("");
      setShowModal(false);
      setIsEditing(true);
    } catch (error) {
      setModalError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.header}>
          <h1>Voluntariado</h1>
          <p className={styles.intro}>
            Aquí puedes enviar tu solicitud para ser parte del voluntariado de
            Castrando Ando. Tu ayuda hace la diferencia en la vida de muchos
            animales.
          </p>
        </div>

        <div className={styles.formContainer}>
          <h2>Formulario de solicitud</h2>
          {submitted ? (
            <div className={styles.successMessage}>
              <h3>¡Gracias por tu interés!</h3>
              <p>
                Hemos recibido tu información correctamente. Nos estaremos
                comunicando contigo pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <Alert variant="danger">{error}</Alert>}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="id" className={styles.label}>
                    Cédula
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={styles.input}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className={styles.input}
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="comment" className={styles.label}>
                  Cuéntanos por qué te gustaría ser voluntario
                </label>
                <textarea
                  className={styles.textarea}
                  id="comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className={styles.buttonGroup}>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.submitButton}
                >
                  {isEditing ? "Guardar cambios" : "Enviar solicitud"}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowModal(true)}
                  className={styles.consultButton}
                >
                  Consultar voluntario
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Consultar Voluntario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleModalSubmit} className={styles.modalForm}>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            <div className={styles.formGroup}>
              <label htmlFor="modalId" className={styles.label}>
                Cédula
              </label>
              <input
                type="text"
                className={styles.input}
                id="modalId"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className={styles.modalButton}
            >
              Buscar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VolunteersPage;
