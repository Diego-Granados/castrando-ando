"use client";
import React, { useState, useRef } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import styles from "./FundsPage.module.css";
import RaffleController from "@/controllers/RaffleController";
import NumberGrid from "@/components/NumberGrid";

const FundsPage = () => {
  const [raffle, setRaffle] = useState({
    id: "1",
    name: "Rifa Mensual",
    description: "Participa en nuestra rifa mensual y ayuda a recaudar fondos.",
    price: 1000,
    date: "31/12/2023",
    image: "/path/to/image.jpg",
  });
  const [showGrid, setShowGrid] = useState(false);
  const [confirmReservation, setConfirmReservation] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [receiptMessage, setReceiptMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleBuyClick = () => {
    setShowGrid(true);
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
    setShowGrid(false);
    setConfirmReservation(true);
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceipt(file);
      setReceiptMessage(`Comprobante adjuntado: ${file.name}`);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleConfirmReservation = async () => {
    if (!name || !phone || !email || !id || !receipt) {
      alert("Por favor complete todos los campos y adjunte el comprobante.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("id", id);
    formData.append("number", selectedNumber);
    formData.append("receipt", receipt);

    try {
      await RaffleController.reserveNumber(raffle.id, formData);
      alert("Número reservado exitosamente. Esperando aprobación.");
      setConfirmReservation(false);
      setSelectedNumber(null);
      setName("");
      setPhone("");
      setEmail("");
      setId("");
      setReceipt(null);
      setReceiptMessage("");
    } catch (error) {
      console.error("Error reservando número:", error);
      alert(
        "Hubo un error al reservar el número. Por favor intente nuevamente."
      );
    }
  };

  const handleCloseModal = () => {
    setShowGrid(false);
    setConfirmReservation(false);
    setSelectedNumber(null);
    setName("");
    setPhone("");
    setEmail("");
    setId("");
    setReceipt(null);
    setReceiptMessage("");
  };

  const handleShowWinner = () => {
    // Implement show winner functionality
  };

  return (
    <div className={styles.container}>
      <h2>Donaciones</h2>
      <p>
        Si desea realizar una donación para apoyar nuestra causa, puede hacerlo
        mediante SINPE móvil al número 8888-8888. Agradecemos su generosidad y
        apoyo.
      </p>
      <h2>Rifas</h2>
      <section
        style={{
          padding: "20px",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p>
          Participa en nuestra rifa y ayuda a recaudar fondos para nuestra
          causa. Estas rifas se realizan cada mes y los ganadores se definen con
          los números ganadores de la loteria nacional. Para la compra de un
          número, el pago se debe realizar mediante SINPE móvil al número
          8888-8888
        </p>
        <div className={styles.raffle}>
          <img
            src={raffle.image}
            alt={`${raffle.name} image`}
            className={styles.raffleImage}
          />
          <h3>{raffle.name}</h3>
          <p>{raffle.description}</p>
          <p>Precio: {raffle.price}</p>
          <p>Fecha de la rifa: {raffle.date}</p>
          <div className={styles.buttons}>
            <button className="btn btn-primary" onClick={handleBuyClick}>
              Participar
            </button>
            <button className="btn btn-secondary" onClick={handleShowWinner}>
              Consultar Ganadores
            </button>
          </div>
        </div>
        {showGrid && (
          <Modal show={showGrid} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Comprar Número</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <NumberGrid onSelect={handleNumberSelect} />
            </Modal.Body>
          </Modal>
        )}
        {confirmReservation && (
          <Modal show={confirmReservation} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Compra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                ¿Desea comprar el número {selectedNumber} por un precio de{" "}
                {raffle.price} colones?
              </p>
              <p>
                Debe adjuntar una imagen del comprobante del pago SINPE móvil
                que se realiza al número 8888-8888
              </p>
              <Form.Group controlId="name">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="phone">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="id">
                <Form.Label>Cédula</Form.Label>
                <Form.Control
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              </Form.Group>
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <button
                className="btn btn-secondary"
                onClick={handleFileInputClick}
              >
                Adjuntar Comprobante
              </button>
              <p className={styles.tabbed}>{receiptMessage}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleConfirmReservation}>
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </section>
    </div>
  );
};

export default FundsPage;
