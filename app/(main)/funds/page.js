"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./FundsPage.module.css";
import RaffleController from "@/controllers/RaffleController";
import Modal from "@/components/Modal";
import useSubscription from "@/hooks/useSubscription";
import { toast } from "react-toastify";
import { formatNumber } from "@/utils/formatters";

const FundsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    const initializeRaffles = async () => {
      try {
        const fetchedRaffles = await RaffleController.getAllRafflesOnce();
        const currentDate = new Date();

        // Process and sort raffles
        const processedRaffles = Object.entries(fetchedRaffles || {})
          .map(([id, raffle]) => ({
            id,
            ...raffle,
            status:
              new Date(raffle.date) < currentDate ? "inactive" : raffle.status,
          }))
          .sort((a, b) => {
            // Sort by active status first
            if (a.status === "active" && b.status !== "active") return -1;
            if (a.status !== "active" && b.status === "active") return 1;

            // Then by date (most recent first)
            return new Date(b.date) - new Date(a.date);
          });

        setRaffles(processedRaffles);

        // Check for raffle ID in URL
        const raffleId = searchParams.get("raffleId");
        if (raffleId) {
          const raffleFromUrl = processedRaffles.find((r) => r.id === raffleId);
          if (raffleFromUrl) {
            setSelectedRaffle(raffleFromUrl);
            setShowNumbers(true);
            return;
          }
        }

        // If no URL parameter or raffle not found, select most recent active raffle
        const activeRaffles = processedRaffles.filter(
          (r) => r.status === "active"
        );
        if (activeRaffles.length > 0) {
          setSelectedRaffle(activeRaffles[0]);
          router.push(`/funds?raffleId=${activeRaffles[0].id}`, {
            scroll: false,
          });
        }
      } catch (error) {
        console.error("Error fetching raffles:", error);
        toast.error("Error cargando las rifas");
      }
    };

    initializeRaffles();
  }, [searchParams]);

  // Suscripción a todas las rifas
  const { loading: loadingRaffles, error: rafflesError } = useSubscription(
    () => RaffleController.subscribeToAllRaffles(setRaffles),
    []
  );

  // Suscripción a la rifa seleccionada cuando cambia
  const { loading: loadingRaffle, error: raffleError } = useSubscription(
    () =>
      selectedRaffle?.id
        ? RaffleController.subscribeToRaffle(
            selectedRaffle.id,
            setSelectedRaffle
          )
        : () => {},
    [selectedRaffle?.id]
  );

  const handleRaffleChange = (event) => {
    const raffleId = event.target.value;
    const raffle = raffles.find((r) => r.id === raffleId);
    setSelectedRaffle(raffle);
    setShowNumbers(false);
    if (raffle) {
      router.push(`/funds?raffleId=${raffle.id}`, { scroll: false });
    }
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

      const fetchedRaffles = await RaffleController.getAllRafflesOnce(
        setRaffles
      );
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

      toast.success("Número reservado exitosamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error reserving number:", error);
      toast.error(`Error al reservar el número: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/funds?raffleId=${selectedRaffle.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado al portapapeles");
  };

  const getNumberStatus = (numberData) => {
    if (numberData.approved) return styles.approved;
    if (numberData.purchased) return styles.pending;
    return "";
  };

  if (loadingRaffles) return <div>Cargando rifas...</div>;
  if (rafflesError)
    return <div>Error al cargar las rifas: {rafflesError.message}</div>;

  return (
    <div className={styles.container}>
      <h1>Rifas</h1>
      <select
        onChange={handleRaffleChange}
        className={styles.select}
        value={selectedRaffle?.id || ""}
      >
        <option value="">Seleccione una rifa</option>
        {raffles.map((raffle) => (
          <option key={raffle.id} value={raffle.id}>
            {raffle.name}
          </option>
        ))}
      </select>
      {selectedRaffle && (
        <button
          onClick={handleCopyLink}
          className={styles.copyButton}
          title="Copiar link"
        >
          Copiar Link
        </button>
      )}

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
                <strong>Precio:</strong> ₡{formatNumber(selectedRaffle.price)}
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
