"use client";

import React, { useState } from 'react';
import styles from './SalesPage.module.css';
import Modal from '@/components/Modal';

const SalesPage = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'Producto de Mascota 1', image: '/images/placeholder.png', price: '₡5000', contact: 'contacto1@example.com', available: 10 },
        { id: 2, name: 'Producto de Mascota 2', image: '/images/placeholder.png', price: '₡7000', contact: 'contacto2@example.com', available: 5 },
        { id: 3, name: 'Producto de Mascota 3', image: '/images/placeholder.png', price: '₡6000', contact: 'contacto3@example.com', available: 8 },
        { id: 4, name: 'Joyería y Accesorio 1', image: '/images/placeholder.png', price: '₡15000', contact: 'contacto4@example.com', available: 3 },
        { id: 5, name: 'Joyería y Accesorio 2', image: '/images/placeholder.png', price: '₡20000', contact: 'contacto5@example.com', available: 7 },
        { id: 6, name: 'Joyería y Accesorio 3', image: '/images/placeholder.png', price: '₡18000', contact: 'contacto6@example.com', available: 2 },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', image: '', price: '', contact: '', available: '' });

    const handleAddProduct = () => {
        setShowModal(true);
    };

    const handleSaveProduct = () => {
        setProducts([...products, { ...newProduct, id: products.length + 1, image: '/images/placeholder.png' }]);
        setShowModal(false);
        setNewProduct({ name: '', image: '', price: '', contact: '', available: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleDelete = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const handleEdit = (id) => {
        // Aquí puedes agregar la lógica para editar un producto
        console.log(`Editar producto con id: ${id}`);
    };

    return (
        <div className={styles.container}>
            <h1>Productos en Venta</h1>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAddProduct}>Agregar Producto</button>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Imagen</th>
                        <th>Precio</th>
                        <th>Contacto</th>
                        <th>Disponibles</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td><img src={product.image} alt={product.name} className={styles.productImage} /></td>
                            <td>{product.price}</td>
                            <td>{product.contact}</td>
                            <td>{product.available}</td>
                            <td>
                                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleEdit(product.id)}>Modificar</button>
                                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(product.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <Modal title="Agregar Nuevo Producto" onClose={() => setShowModal(false)}>
                    <div className={styles.formGroup}>
                        <label>Nombre:</label>
                        <input type="text" name="name" value={newProduct.name} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Precio:</label>
                        <input type="text" name="price" value={newProduct.price} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Contacto:</label>
                        <input type="text" name="contact" value={newProduct.contact} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Disponibles:</label>
                        <input type="number" name="available" value={newProduct.available} onChange={handleChange} />
                    </div>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSaveProduct}>Guardar</button>
                </Modal>
            )}
        </div>
    );
};

export default SalesPage;