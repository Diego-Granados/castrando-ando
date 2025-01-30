"use client";
import { formatNumber } from "@/utils/formatters";
import { useState, useEffect } from "react";
import styles from "./SalesPage.module.css";
import { Button, Table, Modal, Alert, Form } from "react-bootstrap";
import { Pencil, Trash2, Plus, Minus } from "lucide-react";
import SalesController from "@/controllers/SalesController";
import { ToastContainer, toast } from "react-toastify";

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
      toast.success("Producto guardado exitosamente");
    } catch (error) {
      setModalError(`Error saving product: ${error.message}`);
      console.error("Error saving product:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await SalesController.deleteProduct(productId);
      const fetchedProducts = await SalesController.getAllProducts();
      setProducts(Object.values(fetchedProducts));
      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(`Error al eliminar: ${error.message}`);
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const updatedQuantity = parseInt(product.quantity) + 1;
        const updatedProduct = {
          ...product,
          quantity: updatedQuantity,
        };

        await SalesController.createOrUpdateProduct(updatedProduct);

        // Actualizar el estado local
        setProducts(
          products.map((p) =>
            p.id === productId ? { ...p, quantity: updatedQuantity } : p
          )
        );
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product && product.quantity > 0) {
        const updatedQuantity = parseInt(product.quantity) - 1;
        const updatedProduct = {
          ...product,
          quantity: updatedQuantity,
        };

        await SalesController.createOrUpdateProduct(updatedProduct);

        // Actualizar el estado local
        setProducts(
          products.map((p) =>
            p.id === productId ? { ...p, quantity: updatedQuantity } : p
          )
        );
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Productos</h1>
          <p className={styles.subtitle}>
            Administra los productos disponibles para la venta
          </p>
          <Button className={styles.addButton} onClick={handleAdd}>
            <Plus size={20} className={styles.buttonIcon} /> Agregar Producto
          </Button>
        </div>

        <div className={styles.tableWrapper}>
          <Table hover className={styles.table}>
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
                  <td className={styles.imageCell}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.tableImage}
                    />
                  </td>
                  <td className={styles.priceCell}>
                    ₡{formatNumber(product.price)}
                  </td>
                  <td className={styles.descriptionCell}>
                    {product.description}
                  </td>
                  <td>{product.category}</td>
                  <td className={styles.quantityCell}>
                    <div className={styles.quantityControls}>
                      <Button
                        variant="outline"
                        className={styles.quantityButton}
                        onClick={() => handleDecreaseQuantity(product.id)}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className={styles.quantity}>
                        {product.quantity}
                      </span>
                      <Button
                        variant="outline"
                        className={styles.quantityButton}
                        onClick={() => handleIncreaseQuantity(product.id)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </td>
                  <td className={styles.actions}>
                    <Button
                      variant="outline-primary"
                      className={styles.actionButton}
                      onClick={() => handleEdit(product)}
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className={styles.actionButton}
                      onClick={() => handleDelete(product.id)}
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
                    alt="Preview"
                    className={styles.modalImage}
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
    </div>
  );
};

export default SalesPage;
