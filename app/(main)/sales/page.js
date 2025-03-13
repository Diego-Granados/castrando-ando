"use client";
import React, { useState, useEffect } from "react";
import styles from "./SalesPage.module.css";
import Modal from "@/components/Modal";
import SalesController from "@/controllers/SalesController";
import { ShoppingBag, Phone, Mail } from "lucide-react";
import { formatNumber } from "@/utils/formatters";

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

  const ProductCard = ({ product }) => (
    <div className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.productImage}
        />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDescription}>{product.description}</p>
        <div className={styles.productMeta}>
          <span className={styles.price}>₡{formatNumber(product.price)}</span>
          <span className={styles.stock}>
            {product.quantity > 0
              ? `${product.quantity} disponibles`
              : "Agotado"}
          </span>
        </div>
        <button
          className={styles.buyButton}
          onClick={() => handleConsultClick(product)}
          disabled={product.quantity === 0}
        >
          <ShoppingBag size={18} />
          {product.quantity > 0 ? "Adquirir" : "Agotado"}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Catálogo de Productos</h1>
        <p className={styles.subtitle}>
          Explora nuestra selección de productos. Todas las ganancias son
          destinadas a apoyar nuestra causa.
        </p>
      </div>

      <section className={styles.categorySection}>
        <h2>Productos para Mascotas</h2>
        <div className={styles.productsGrid}>
          {petProducts.length > 0 ? (
            petProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <p className={styles.emptyMessage}>
              No hay artículos disponibles en esta categoría.
            </p>
          )}
        </div>
      </section>

      <section className={styles.categorySection}>
        <h2>Joyería y Accesorios</h2>
        <div className={styles.productsGrid}>
          {jewelryProducts.length > 0 ? (
            jewelryProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <p className={styles.emptyMessage}>
              No hay artículos disponibles en esta categoría.
            </p>
          )}
        </div>
      </section>

      {showContact && (
        <Modal title="Información de Contacto" onClose={handleCloseModal}>
          <div className={styles.modalContent}>
            <div className={styles.selectedProduct}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className={styles.modalImage}
              />
              <div className={styles.productDetails}>
                <h3>{selectedProduct.name}</h3>
                <p className={styles.modalPrice}>
                  ₡{formatNumber(selectedProduct.price)}
                </p>
              </div>
            </div>
            <div className={styles.contactInfo}>
              <p>Para adquirir este producto, contáctenos:</p>
              <div className={styles.contactMethod}>
                <Phone size={20} />
                <span>8761-0142</span>
              </div>
              <div className={styles.contactMethod}>
                <Mail size={20} />
                <span>asociacioncastrandoando@gmail.com</span>
              </div>
            </div>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SalesPage;
