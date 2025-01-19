"use client";

import { useState, useEffect } from "react";
import styles from "./SalesPage.module.css";
import { Button, Table, Modal, Alert, Form } from "react-bootstrap";
import { Pencil, Trash2, Plus, Minus } from "lucide-react";
import SalesController from "@/controllers/SalesController";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("mascotas");
  const [quantity, setQuantity] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await SalesController.getAllProducts();
        console.log("Fetched products:", fetchedProducts); // Debugging log
        setProducts(Object.values(fetchedProducts));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setId("");
    setName("");
    setImage("");
    setPrice("");
    setDescription("");
    setCategory("mascotas");
    setQuantity(0);
    setFile(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setId(product.id);
    setName(product.name);
    setImage(product.image);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.category);
    setQuantity(product.quantity);
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
      const productData = {
        id: id || Date.now().toString(),
        name,
        image,
        price,
        description,
        category,
        quantity,
      };
      await SalesController.createOrUpdateProduct(productData, file);
      setShowModal(false);
      const fetchedProducts = await SalesController.getAllProducts();
      setProducts(Object.values(fetchedProducts));
    } catch (error) {
      setModalError(`Error saving product: ${error.message}`);
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await SalesController.deleteProduct(productId);
      const fetchedProducts = await SalesController.getAllProducts();
      setProducts(Object.values(fetchedProducts));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product) {
        product.quantity += 1;
        await SalesController.createOrUpdateProduct(product);
        setProducts([...products]);
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product && product.quantity > 0) {
        product.quantity -= 1;
        await SalesController.createOrUpdateProduct(product);
        setProducts([...products]);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className="d-flex flex-column align-items-start mb-4 ms-5">
        <h1>Productos en Venta</h1>
        <Button className={styles.btn} onClick={handleAdd}>
          Agregar Producto
        </Button>
      </div>
      <Table striped bordered hover className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
              </td>
              <td>¢{product.price}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td>
                <Button
                  variant="outline-primary"
                  className={styles.btn}
                  onClick={() => handleEdit(product)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="outline-danger"
                  className={styles.btn}
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 size={16} />
                </Button>
                <Button
                  variant="outline"
                  className={styles.btn}
                  onClick={() => handleIncreaseQuantity(product.id)}
                >
                  <Plus size={16} />
                </Button>
                <Button
                  variant="outline"
                  className={styles.btn}
                  onClick={() => handleDecreaseQuantity(product.id)}
                >
                  <Minus size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Producto" : "Agregar Producto"}
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
                  className={`${styles.productImage} mt-2`}
                />
              )}
            </Form.Group>
            <Form.Group controlId="price" className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="mascotas">Mascotas</option>
                <option value="joyeria y otros">Joyería y Otros</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="quantity" className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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

export default SalesPage;
