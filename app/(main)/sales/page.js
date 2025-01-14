
"use client";
import React, { useState } from 'react';
import styles from './SalesPage.module.css';
import Modal from '@/components/Modal';

const SalesPage = () => {
    const [showContact, setShowContact] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const petProducts = [
        { name: 'Producto de Mascota 1', image: '/placeholder.png', price: '₡5000', available: "10"},
        { name: 'Producto de Mascota 2', image: '/placeholder.png', price: '₡7000', available: "5"},
        { name: 'Producto de Mascota 3', image: '/placeholder.png', price: '₡6000', available: "3"},
        { name: 'Producto de Mascota 4', image: '/placeholder.png', price: '₡7000', available: "7"},
        { name: 'Producto de Mascota 5', image: '/placeholder.png', price: '₡6000', available: "4"},
    ];

    const jewelryProducts = [
        { name: 'Joyería y Accesorio 1', image: '/placeholder.png', price: '₡15000', available: "2"},
        { name: 'Joyería y Accesorio 2', image: '/placeholder.png', price: '₡20000', available: "1"},
        { name: 'Joyería y Accesorio 3', image: '/placeholder.png', price: '₡18000', available: "3"},
        { name: 'Joyería y Accesorio 4', image: '/placeholder.png', price: '₡18000', available: "2"},
        { name: 'Joyería y Accesorio 5', image: '/placeholder.png', price: '₡20000', available: "5"},
        { name: 'Joyería y Accesorio 6', image: '/placeholder.png', price: '₡18000', available: "2"},
    ];

    const handleConsultClick = (product) => {
        setSelectedProduct(product);
        setShowContact(true);
    };

    const handleCloseModal = () => {
        setShowContact(false);
        setSelectedProduct(null);
    };

    return (
        <div className={styles.container}>
            <h1>Ventas de productos</h1>
            <p>Bienvenidos, en esta sección se pueden encontrar los productos disponibles a la venta.</p>

            <section className={styles.category}>
                <h2>Productos de Mascotas</h2>
                <div className={styles.catalog}>
                    {petProducts.map((product, index) => (
                        <div key={index} className={styles.product}>
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                            <h3>{product.name}</h3>
                            <p>Precio: {product.price} &nbsp;
                            Disponibles: {product.available}</p>
                            <button className="btn btn-primary" onClick={() => handleConsultClick(product)}>Adquirir</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.category}>
                <h2>Joyería y Accesorios</h2>
                <div className={styles.catalog}>
                    {jewelryProducts.map((product, index) => (
                        <div key={index} className={styles.product}>
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                            <h3>{product.name}</h3>
                            <p>Precio: {product.price} &nbsp;
                            Disponibles: {product.available}</p>
                            <button className="btn btn-primary" onClick={() => handleConsultClick(product)}>Adquirir</button>
                        </div>
                    ))}
                </div>
            </section>

            {showContact && (
                <Modal title="Información de Contacto" onClose={handleCloseModal}>
                    <p>Para consultar sobre {selectedProduct.name}, por favor contacte al vendedor:</p>
                    <p>Teléfono: 8888-8888</p>
                    <p>Email: vendedor@example.com</p>
                    <div className={styles.buttons}>
                        <button className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SalesPage;