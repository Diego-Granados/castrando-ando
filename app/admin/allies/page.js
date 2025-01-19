"use client";

import { useState, useEffect } from "react";
import styles from "./AlliesPage.module.css";
import { Button, Table, Modal, Alert, Form } from "react-bootstrap";
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
    console.log("handleSave called"); // Debugging log
    try {
      const allyData = {
        id: id || Date.now().toString(),
        name,
        image,
        link,
        description,
      };
      await AllyController.createOrUpdateAlly(allyData, file);
      setShowModal(false);
      const fetchedAllies = await AllyController.getAllAllies();
      setAllies(Object.values(fetchedAllies));
    } catch (error) {
      setModalError(`Error saving ally: ${error.message}`);
      console.error("Error saving ally:", error);
    }
  };

  const handleDelete = async (allyId) => {
    try {
      await AllyController.deleteAlly(allyId);
      const fetchedAllies = await AllyController.getAllAllies();
      setAllies(Object.values(fetchedAllies));
    } catch (error) {
      console.error("Error deleting ally:", error);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column align-items-start mb-4 ms-5">
        <h1>Nuestros Aliados</h1>
        <Button className={styles.btn} onClick={handleAdd}>
          Agregar Aliado
        </Button>
      </div>
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
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form onSubmit={handleSave}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              {image && !file && (
                <img
                  src={image}
                  alt="Current"
                  className={`${styles.image} mt-2`}
                />
              )}
            </Form.Group>
            <Form.Group controlId="link" className="mb-3">
              <Form.Label>Enlace</Form.Label>
              <Form.Control
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className={styles.btn}>
              {isEditing ? "Guardar cambios" : "Agregar"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AlliesPage;
