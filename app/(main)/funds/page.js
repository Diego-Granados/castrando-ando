"use client";
import React, { useState, useEffect } from "react";
import styles from "./FundsPage.module.css";
import RaffleController from "@/controllers/RaffleController";
import NotificationController from "@/controllers/NotificationController";
import Modal from "@/components/Modal";

const FundsPage = () => {
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [raffles, setRaffles] = useState([]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [formData, setFormData] = useState({
    buyer: "",
    id: "",
    phone: "",
    receipt: null,
  });

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const fetchedRaffles = await RaffleController.getAllRaffles();
        const rafflesArray = Object.entries(fetchedRaffles || {}).map(
          ([id, raffle]) => ({
            id,
            ...raffle,
          })
        );
        setRaffles(rafflesArray);
      } catch (error) {
        console.error("Error fetching raffles:", error);
        setRaffles([]);
      }
    };
    fetchRaffles();
  }, []);

  const handleRaffleChange = (event) => {
    const raffleId = event.target.value;
    const raffle = raffles.find((r) => r.id === raffleId);
    setSelectedRaffle(raffle);
    setShowNumbers(false);
  };

  const handleBuyClick = () => {
    setShowNumbers(true);
  };

  const handleNumberClick = (number, numberData) => {
    if (selectedRaffle.status === "finished") {
      return; // Don't do anything if raffle is finished
    }

    if (numberData.status === "available") {
      setSelectedNumber(number);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedNumber(null);
    setFormData({
      buyer: "",
      id: "",
      phone: "",
      receipt: null,
    });
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const numberData = {
        ...formData,
        status: "pending",
        purchased: true,
        approved: false,
      };

      await RaffleController.updateNumber(
        selectedRaffle.id,
        selectedNumber,
        numberData
      );

      // Send notification to admin
      await NotificationController.createAdminNotification({
        title: "Nueva Compra de Rifa Pendiente",
        message: `${formData.buyer} ha comprado el número ${selectedNumber} de la rifa "${selectedRaffle.name}". Pendiente de aprobación.`,
        type: "raffle_purchase",
        link: `/admin/raffles`,
        raffleId: selectedRaffle.id,
        numberRequested: selectedNumber
      });

      const fetchedRaffles = await RaffleController.getAllRaffles();
      const rafflesArray = Object.entries(fetchedRaffles || {}).map(
        ([id, raffle]) => ({
          id,
          ...raffle,
        })
      );

      setRaffles(rafflesArray);

      const updatedSelectedRaffle = rafflesArray.find(
        (raffle) => raffle.id === selectedRaffle.id
      );
      setSelectedRaffle(updatedSelectedRaffle);

      setShowModal(false);
      setSelectedNumber(null);
      setFormData({
        buyer: "",
        id: "",
        phone: "",
        receipt: null,
      });

      alert("Número reservado exitosamente");
    } catch (error) {
      console.error("Error reserving number:", error);
      alert("Error al reservar el número: " + error.message);
    }
  };

  const getNumberStatus = (numberData) => {
    if (numberData.approved) return styles.approved;
    if (numberData.purchased) return styles.pending;
    return "";
  };

  return (
    <div className={styles.container}>
      <h1>Rifas</h1>
      <select onChange={handleRaffleChange} className={styles.select}>
        <option value="">Seleccione una rifa</option>
        {raffles.map((raffle) => (
          <option key={raffle.id} value={raffle.id}>
            {raffle.name}
          </option>
        ))}
      </select>

      {selectedRaffle && (
        <div className={styles.raffleInfo}>
          <div className={styles.raffleContent}>
            <div className={styles.raffleDetails}>
              <h2>Información de la Rifa</h2>
              <p>
                <strong>Nombre:</strong> {selectedRaffle.name}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedRaffle.description}
              </p>
              <p>
                <strong>Precio:</strong> ¢{selectedRaffle.price}.00
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(selectedRaffle.date).toLocaleDateString()}
              </p>
            </div>

            {selectedRaffle.image && (
              <div className={styles.prizeContainer}>
                <h3>Premio</h3>
                <div className={styles.imageContainer}>
                  <img
                    src={selectedRaffle.image}
                    alt={selectedRaffle.name}
                    className={styles.raffleImage}
                  />
                </div>
              </div>
            )}
          </div>

          {selectedRaffle.status === "finished" ? (
            <div className={styles.winnerInfo}>
              <h3>¡Rifa Finalizada!</h3>
              <p>
                <strong>Número Ganador:</strong> {selectedRaffle.winner}
              </p>
              <p>
                <strong>Ganador:</strong> {selectedRaffle.winnerName}
              </p>
            </div>
          ) : (
            <button onClick={handleBuyClick} className={styles.buyButton}>
              Ver Números
            </button>
          )}

          {showNumbers && (
            <div className={styles.numbersGrid}>
              {Object.entries(selectedRaffle.numbers).map(
                ([number, numberData]) => (
                  <div
                    key={number}
                    className={`${styles.number} ${getNumberStatus(
                      numberData
                    )}`}
                    onClick={() => handleNumberClick(number, numberData)}
                    style={{
                      cursor:
                        selectedRaffle.status === "finished"
                          ? "default"
                          : "pointer",
                    }}
                  >
                    {number}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal onClose={handleModalClose} className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              Reservar Número {selectedNumber}
            </h2>
            <form onSubmit={handleFormSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nombre:
                  <input
                    type="text"
                    name="buyer"
                    value={formData.buyer}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Cédula:
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Teléfono:
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </label>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Comprobante:
                  <div className={styles.customFileInput}>
                    <input
                      type="file"
                      name="receipt"
                      onChange={handleInputChange}
                      className={styles.fileInputHidden}
                      required
                      id="receipt"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("receipt").click()}
                      className={styles.fileButton}
                    >
                      Seleccionar archivo
                    </button>
                    {formData.receipt && (
                      <span className={styles.fileName}>
                        {formData.receipt.name}
                      </span>
                    )}
                  </div>
                </label>
              </div>
              <div className={styles.modalButtons}>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className={`${styles.button} ${styles.cancelButton}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.submitButton}`}
                >
                  Reservar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      <div className={styles.info}>
        <p>
          Participa en nuestra rifa y ayuda a recaudar fondos para nuestra
          causa.
        </p>
        <p>
          Estas rifas se realizan cada mes y los ganadores se definen con los
          números ganadores de la lotería nacional. Para la compra de un número,
          el pago se debe realizar mediante SINPE móvil al número 8888-8888.
        </p>
      </div>
    </div>
  );
};

export default FundsPage;
