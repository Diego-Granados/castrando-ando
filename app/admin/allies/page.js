"use client";
import React, { useState, useEffect } from "react";
import styles from "./AlliesPage.module.css";
import { Button, Table, Modal, Alert } from "react-bootstrap";
import { Pencil, Trash2 } from "lucide-react";
import AllyController from "@/controllers/AllyController";

const AlliesPage = () => {
  const [allies, setAllies] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAllies = async () => {
      try {
        const fetchedAllies = await AllyController.getAllies();
        setAllies(fetchedAllies);
      } catch (error) {
        console.error("Error fetching allies:", error);
      }
    };
    fetchAllies();
  }, []);

  const handleEdit = (ally) => {
    setId(ally.id);
    setName(ally.name);
    setImage(ally.image);
    setLink(ally.link);
    setDescription(ally.description);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este aliado?"
    );
    if (confirmDelete) {
      try {
        await AllyController.deleteAlly(id);
        setAllies(allies.filter((ally) => ally.id !== id));
      } catch (error) {
        console.error("Error deleting ally:", error);
      }
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const allyData = { name, image, link, description };
    try {
      if (isEditing) {
        await AllyController.updateAlly(id, allyData);
        setAllies(
          allies.map((ally) => (ally.id === id ? { id, ...allyData } : ally))
        );
      } else {
        const newAlly = await AllyController.createAlly(allyData);
        setAllies([...allies, newAlly]);
      }
      setShowModal(false);
      setIsEditing(false);
      setId("");
      setName("");
      setImage("");
      setLink("");
      setDescription("");
    } catch (error) {
      setModalError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Aliados</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Agregar Aliado
      </Button>
      <Table striped bordered hover className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Enlace</th>
            <th>Descripción</th>
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
                  className={styles.image}
                />
              </td>
              <td>
                <a href={ally.link} target="_blank" rel="noopener noreferrer">
                  {ally.link}
                </a>
              </td>
              <td>{ally.description}</td>
              <td>
                <Button
                  variant="outline-primary"
                  className={styles.btn}
                  onClick={() => handleEdit(ally)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="outline-danger"
                  className={styles.btn}
                  onClick={() => handleDelete(ally.id)}
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
          <Modal.Title>
            {isEditing ? "Editar Aliado" : "Agregar Aliado"}
          </Modal.Title>
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
              <label htmlFor="image" className="form-label">
                Imagen
              </label>
              <input
                type="text"
                className="form-control"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="link" className="form-label">
                Enlace
              </label>
              <input
                type="text"
                className="form-control"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Descripción
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <Button type="submit" variant="primary">
              {isEditing ? "Guardar cambios" : "Agregar"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AlliesPage;
