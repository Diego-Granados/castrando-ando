"use client";
import React, { useState, useEffect } from "react";
import styles from "./SalesPage.module.css";
import Modal from "@/components/Modal";
import SalesController from "@/controllers/SalesController";

const SalesPage = () => {
  const [showContact, setShowContact] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [petProducts, setPetProducts] = useState([]);
  const [jewelryProducts, setJewelryProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await SalesController.getAllProducts();
        const products = Object.values(fetchedProducts);
        const pets = products.filter(
          (product) => product.category === "mascotas"
        );
        const jewelry = products.filter(
          (product) => product.category === "joyeria y otros"
        );
        setPetProducts(pets);
        setJewelryProducts(jewelry);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

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
      <p>
        Bienvenidos, en esta sección se pueden encontrar los productos
        disponibles a la venta.
      </p>

      <section className={styles.category}>
        <h2>Productos de Mascotas</h2>
        <div className={styles.catalog}>
          {petProducts.length > 0 ? (
            petProducts.map((product, index) => (
              <div key={index} className={styles.product}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <h3>{product.name}</h3>
                <p>
                  Precio: ¢{product.price} &nbsp; Disponibles:{" "}
                  {product.quantity}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConsultClick(product)}
                >
                  Adquirir
                </button>
              </div>
            ))
          ) : (
            <p>No hay artículos disponibles en esta categoría.</p>
          )}
        </div>
      </section>

      <section className={styles.category}>
        <h2>Joyería y Accesorios</h2>
        <div className={styles.catalog}>
          {jewelryProducts.length > 0 ? (
            jewelryProducts.map((product, index) => (
              <div key={index} className={styles.product}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <h3>{product.name}</h3>
                <p>
                  Precio: ¢{product.price} &nbsp; Disponibles:{" "}
                  {product.quantity}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConsultClick(product)}
                >
                  Adquirir
                </button>
              </div>
            ))
          ) : (
            <p>No hay artículos disponibles en esta categoría.</p>
          )}
        </div>
      </section>

      {showContact && (
        <Modal title="Información de Contacto" onClose={handleCloseModal}>
          <p>
            Para consultar sobre {selectedProduct.name}, por favor contacte al
            vendedor:
          </p>
          <p>Teléfono: 8888-8888</p>
          <p>Email: vendedor@example.com</p>
          <div className={styles.buttons}>
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SalesPage;
