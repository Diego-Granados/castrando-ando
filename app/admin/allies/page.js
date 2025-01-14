"use client";
import React, { useState } from "react";
import styles from "./AlliesPage.module.css";
import { Button, Table } from "react-bootstrap";
import { Cross, Pencil, Send, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";

const AlliesPage = () => {
  const [allies, setAllies] = useState([
    {
      id: 1,
      name: "Aliado 1",
      image: "/images/placeholder.png",
      link: "https://example.com/aliado1",
    },
    {
      id: 2,
      name: "Aliado 2",
      image: "/images/placeholder.png",
      link: "https://example.com/aliado2",
    },
    {
      id: 3,
      name: "Aliado 3",
      image: "/images/placeholder.png",
      link: "https://example.com/aliado3",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAlly, setNewAlly] = useState({ name: "", image: "", link: "" });

  const handleAddAlly = () => {
    setShowModal(true);
  };

  const handleSaveAlly = () => {
    setAllies([...allies, { ...newAlly, id: allies.length + 1 }]);
    setShowModal(false);
    setNewAlly({ name: "", image: "", link: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAlly({ ...newAlly, [name]: value });
  };

  const handleDelete = (id) => {
    setAllies(allies.filter((ally) => ally.id !== id));
  };

  const handleEdit = (id) => {
    // Aquí puedes agregar la lógica para editar un aliado
    console.log(`Editar aliado con id: ${id}`);
  };

  return (
    <div className={styles.container}>
      <h1>Aliados</h1>
      <button
        className={`${styles.btn} ${styles.btnPrimary}`}
        onClick={handleAddAlly}
      >
        Agregar Aliado
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Enlace</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allies.map((ally) => (
            <tr key={ally.id}>
              <td>{ally.name}</td>
              <td>
                <img
                  src={ally.image}
                  alt={ally.name}
                  className={styles.allyImage}
                />
              </td>
              <td>
                <a href={ally.link} target="_blank" rel="noopener noreferrer">
                  {ally.link}
                </a>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  className={styles.btn}
                  onClick={() => handleEdit(volunteer.id)}
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
      </table>

      {showModal && (
        <Modal title="Agregar Nuevo Aliado" onClose={() => setShowModal(false)}>
          <div className={styles.formGroup}>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={newAlly.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Imagen (URL):</label>
            <input
              type="text"
              name="image"
              value={newAlly.image}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Enlace:</label>
            <input
              type="text"
              name="link"
              value={newAlly.link}
              onChange={handleChange}
            />
          </div>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSaveAlly}
          >
            Guardar
          </button>
        </Modal>
      )}
    </div>
  );
};

export default AlliesPage;
