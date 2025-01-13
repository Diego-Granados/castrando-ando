"use client";

import React, { useState } from 'react';
import styles from './VolunteersPage.module.css';

const VolunteersPage = () => {
    const [volunteers, setVolunteers] = useState([
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '8888-8888', comment: 'Disponible los fines de semana' },
        { id: 2, name: 'María López', email: 'maria@example.com', phone: '8777-7777', comment: 'Puede ayudar con eventos' },
        { id: 3, name: 'Carlos Sánchez', email: 'carlos@example.com', phone: '8666-6666', comment: 'Disponible para transporte' },
    ]);

    const handleDelete = (id) => {
        setVolunteers(volunteers.filter(volunteer => volunteer.id !== id));
    };

    const handleEdit = (id) => {
        // Aquí puedes agregar la lógica para editar un voluntario
        console.log(`Editar voluntario con id: ${id}`);
    };

    return (
        <div className={styles.container}>
            <h1>Voluntarios</h1>
            <table className={styles.table}>
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
                    {volunteers.map(volunteer => (
                        <tr key={volunteer.id}>
                            <td>{volunteer.name}</td>
                            <td>{volunteer.email}</td>
                            <td>{volunteer.phone}</td>
                            <td>{volunteer.comment}</td>
                            <td>
                                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleEdit(volunteer.id)}>Modificar</button>
                                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(volunteer.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VolunteersPage;