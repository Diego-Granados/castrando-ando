"use client";

import React, { useState } from "react";
import styles from "./VolunteersPage.module.css";

const VolunteersPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos a tu backend o Firebase
    console.log("Nombre:", name);
    console.log("Correo electrónico:", email);
    console.log("Teléfono:", phone);
    console.log("Dirección:", address);
    console.log("Mensaje:", message);
    console.log("id:", id);
    setSubmitted(true);
  };

  return (
    <div className="container">
      <h1>Voluntariado</h1>
      <p>
        Bienvenidos. Aquí puedes enviar tu información para ser parte del
        voluntariado de Castrando Ando.
      </p>

      <section style={{ padding: "20px" }}>
        <h2>Formulario de solicitud</h2>
        {submitted ? (
          <p>
            Gracias por enviar tu información! nos estaremos comunicando
            contigo.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
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
              <label htmlFor="address" className="form-label">
                Ubicación
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Comentario
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Subir
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Consultar solicitud
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default VolunteersPage;
