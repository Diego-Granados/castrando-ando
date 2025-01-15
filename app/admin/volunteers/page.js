"use client";

import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Pencil, Send, Trash2 } from "lucide-react";
import styles from "./VolunteersPage.module.css";

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "8888-8888",
      comment: "Disponible los fines de semana",
    },
    {
      id: 2,
      name: "María López",
      email: "maria@example.com",
      phone: "8777-7777",
      comment: "Puede ayudar con eventos",
    },
    {
      id: 3,
      name: "Carlos Sánchez",
      email: "carlos@example.com",
      phone: "8666-6666",
      comment: "Disponible para transporte",
    },
  ]);

  const handleDelete = (id) => {
    setVolunteers(volunteers.filter((volunteer) => volunteer.id !== id));
  };

  const handleEdit = (id) => {
    // Aquí puedes agregar la lógica para editar un voluntario
    console.log(`Editar voluntario con id: ${id}`);
  };

  return (
    <div className={styles.container}>
      <h1>Voluntarios</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
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
              <td>{volunteer.email}</td>
              <td>{volunteer.phone}</td>
              <td>{volunteer.comment}</td>
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

                <Button
                  variant="outline-success"
                  className={styles.btn}
                  onClick={() => handleDelete(volunteer.id)}
                >
                  <Send size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>{" "}
    </div>
  );
};

export default VolunteersPage;
