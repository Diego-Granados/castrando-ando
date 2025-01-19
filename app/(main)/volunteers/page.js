"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import VolunteerController from "@/controllers/VolunteerController";
import styles from "./VolunteersPage.module.css";

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
        await VolunteerController.createVolunteer(newVolunteer);
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
        <h1>Voluntariado</h1>
        <p>
          Aquí puedes enviar tu solicitud para ser parte del voluntariado de
          Castrando Ando.
        </p>
        <h2>Formulario de solicitud</h2>
        {submitted ? (
          <p>
            Gracias por enviar tu información! Nos estaremos comunicando
            contigo.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <Alert variant="danger">{error}</Alert>}
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
              <label htmlFor="id" className="form-label">
                Cédula
              </label>
              <input
                type="text"
                className="form-control"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
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
            <div className="mb-3">
              <Button type="submit" variant="primary">
                {isEditing ? "Guardar cambios" : "Enviar solicitud"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowModal(true)}
                style={{ marginLeft: "10px" }}
              >
                Consultar voluntario
              </Button>
            </div>
          </form>
        )}
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ingresar cédula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleModalSubmit} className={styles.modalForm}>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            <div className="mb-3">
              <label htmlFor="modalId" className="form-label">
                Cédula
              </label>
              <input
                type="text"
                className="form-control"
                id="modalId"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary">
              Buscar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VolunteersPage;
