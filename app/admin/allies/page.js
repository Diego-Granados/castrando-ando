"use client";

import { useState, useEffect } from "react";
import styles from "./AlliesPage.module.css";
import { Button, Table, Modal, Alert, Form } from "react-bootstrap";
import { Pencil, Trash2, Plus } from "lucide-react";
import AllyController from "@/controllers/AllyController";
import { toast } from "react-toastify";

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
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchAllies = async () => {
      try {
        const fetchedAllies = await AllyController.getAllAllies();
        setAllies(Object.values(fetchedAllies));
      } catch (error) {
        console.error("Error fetching allies:", error);
      }
    };
    fetchAllies();
  }, []);

  const handleAdd = () => {
    setId("");
    setName("");
    setImage("");
    setLink("");
    setDescription("");
    setFile(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (ally) => {
    setId(ally.id);
    setName(ally.name);
    setImage(ally.image);
    setLink(ally.link);
    setDescription(ally.description);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const allyData = {
        id: id || Date.now().toString(),
        name,
        image,
        link: link || "",
        description,
      };
      await AllyController.createOrUpdateAlly(allyData, file);
      setShowModal(false);
      const fetchedAllies = await AllyController.getAllAllies();
      setAllies(Object.values(fetchedAllies));

      toast.success(
        isEditing
          ? "Aliado actualizado exitosamente"
          : "Aliado creado exitosamente",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error saving ally:", error);
    }
  };

  const handleDelete = async (allyId) => {
    try {
      await AllyController.deleteAlly(allyId);
      const fetchedAllies = await AllyController.getAllAllies();
      setAllies(Object.values(fetchedAllies));

      toast.success("Aliado eliminado exitosamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Error al eliminar aliado: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error deleting ally:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Aliados</h1>
        <p className={styles.subtitle}>
          Administra los aliados de la organización
        </p>
        <Button className={styles.addButton} onClick={handleAdd}>
          <Plus size={20} className={styles.buttonIcon} /> Agregar Aliado
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <Table hover className={styles.table}>
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
                <td className={styles.imageCell}>
                  <img
                    src={ally.image}
                    alt={ally.name}
                    className={styles.tableImage}
                  />
                </td>
                <td className={styles.linkCell}>
                  <a href={ally.link} target="_blank" rel="noopener noreferrer">
                    {ally.link}
                  </a>
                </td>
                <td className={styles.descriptionCell}>{ally.description}</td>
                <td className={styles.actions}>
                  <Button
                    variant="outline-primary"
                    className={styles.actionButton}
                    onClick={() => handleEdit(ally)}
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    className={styles.actionButton}
                    onClick={() => handleDelete(ally.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>
            {isEditing ? "Editar Aliado" : "Agregar Aliado"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="name" className={styles.formGroup}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="image" className={styles.formGroup}>
              <Form.Label>Imagen</Form.Label>
              <div className={styles.imageUpload}>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                {image && !file && (
                  <div className={styles.currentImage}>
                    <img
                      src={image}
                      alt="Current"
                      className={styles.previewImage}
                    />
                  </div>
                )}
              </div>
            </Form.Group>
            <Form.Group controlId="link" className={styles.formGroup}>
              <Form.Label>Enlace (opcional)</Form.Label>
              <Form.Control
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="description" className={styles.formGroup}>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {isEditing ? "Guardar cambios" : "Agregar"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AlliesPage;
