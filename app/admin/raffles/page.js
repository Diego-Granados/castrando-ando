"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Modal, Form, Dropdown } from "react-bootstrap";
import { Check, Trophy, Trash2, Pencil } from "lucide-react";
import RaffleController from "@/controllers/RaffleController";
import styles from "./RafflesPage.module.css";
import { toast } from "react-toastify";
import { formatNumber } from "@/utils/formatters";

const RafflesPage = () => {
  const [raffles, setRaffles] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [raffleName, setRaffleName] = useState("");
  const [raffleDescription, setRaffleDescription] = useState("");
  const [rafflePrice, setRafflePrice] = useState("");
  const [raffleDate, setRaffleDate] = useState("");
  const [raffleImage, setRaffleImage] = useState(null);
  const [winningNumber, setWinningNumber] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const fileInputRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        console.log("Fetching raffles..."); // Debug
        const fetchedRaffles = await RaffleController.getAllRafflesOnce();
        console.log("Fetched raffles:", fetchedRaffles); // Debug

        if (Array.isArray(fetchedRaffles)) {
          const currentDate = new Date();

          // Procesar las rifas
          const processedRaffles = fetchedRaffles.map((raffle) => ({
            ...raffle,
            status: new Date(raffle.date) < currentDate ? "inactive" : "active",
          }));

          // Ordenar las rifas: activas primero, luego por fecha
          const sortedRaffles = processedRaffles.sort((a, b) => {
            if (a.status === "active" && b.status !== "active") return -1;
            if (a.status !== "active" && b.status === "active") return 1;
            return new Date(a.date) - new Date(b.date);
          });

          setRaffles(sortedRaffles);

          // Si hay una rifa seleccionada, actualizar su información
          if (selectedRaffle) {
            const updatedSelectedRaffle = sortedRaffles.find(
              (raffle) => raffle.id === selectedRaffle.id
            );
            if (updatedSelectedRaffle) {
              setSelectedRaffle(updatedSelectedRaffle);
            }
          } else if (sortedRaffles.length > 0) {
            // Si no hay rifa seleccionada, seleccionar la primera activa
            const activeRaffle = sortedRaffles.find(
              (raffle) => raffle.status === "active"
            );
            setSelectedRaffle(activeRaffle || sortedRaffles[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching raffles:", error);
        toast.error("Error al cargar las rifas");
      }
    };

    fetchRaffles();
  }, [selectedRaffle?.id]); // Añadir selectedRaffle.id como dependencia

  const handleApprove = async () => {
    try {
      await RaffleController.updateNumber(
        selectedRaffle.id,
        selectedPurchase.number,
        {
          ...selectedPurchase,
          status: "approved",
          approved: true,
        }
      );

      // Update local state immediately
      const updatedRaffles = raffles.map((raffle) => {
        if (raffle.id === selectedRaffle.id) {
          const updatedNumbers = { ...raffle.numbers };
          updatedNumbers[selectedPurchase.number] = {
            ...updatedNumbers[selectedPurchase.number],
            status: "approved",
            approved: true,
          };
          return {
            ...raffle,
            numbers: updatedNumbers,
          };
        }
        return raffle;
      });

      setRaffles(updatedRaffles);
      setSelectedRaffle(updatedRaffles.find((r) => r.id === selectedRaffle.id));
      setShowImageModal(false);
    } catch (error) {
      console.error("Error approving purchase:", error);
    }
  };

  const handleReject = async () => {
    try {
      await RaffleController.updateNumber(
        selectedRaffle.id,
        selectedPurchase.number,
        {
          number: selectedPurchase.number,
          buyer: "",
          id: "",
          phone: "",
          receipt: "",
          status: "rejected",
          purchased: false,
          approved: false,
        }
      );

      // Actualizar el estado local inmediatamente
      const updatedRaffles = raffles.map((raffle) => {
        if (raffle.id === selectedRaffle.id) {
          const updatedNumbers = { ...raffle.numbers };
          updatedNumbers[selectedPurchase.number] = {
            ...updatedNumbers[selectedPurchase.number],
            buyer: "",
            id: "",
            phone: "",
            receipt: "",
            status: "rejected",
            purchased: false,
            approved: false,
          };
          return {
            ...raffle,
            numbers: updatedNumbers,
          };
        }
        return raffle;
      });

      setRaffles(updatedRaffles);
      setSelectedRaffle(updatedRaffles.find((r) => r.id === selectedRaffle.id));
      setShowImageModal(false);

      // Después de 2 segundos, actualizar a "available"
      setTimeout(async () => {
        const finalUpdate = raffles.map((raffle) => {
          if (raffle.id === selectedRaffle.id) {
            const updatedNumbers = { ...raffle.numbers };
            updatedNumbers[selectedPurchase.number] = {
              ...updatedNumbers[selectedPurchase.number],
              status: "available",
            };
            return {
              ...raffle,
              numbers: updatedNumbers,
            };
          }
          return raffle;
        });

        setRaffles(finalUpdate);
        setSelectedRaffle(finalUpdate.find((r) => r.id === selectedRaffle.id));

        // Actualizar en la base de datos
        await RaffleController.updateNumber(
          selectedRaffle.id,
          selectedPurchase.number,
          {
            number: selectedPurchase.number,
            buyer: "",
            id: "",
            phone: "",
            receipt: "",
            status: "available",
            purchased: false,
            approved: false,
          }
        );
      }, 2000);
    } catch (error) {
      console.error("Error rejecting purchase:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await RaffleController.deletePurchase(
        selectedRaffle.id,
        selectedNumber.number
      );
      const fetchedRaffles = await RaffleController.getAllRaffles();
      setRaffles(Object.values(fetchedRaffles));
      setShowApproveModal(false);
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const handleAnnounceWinner = async () => {
    try {
      if (!winningNumber) {
        toast.error("Por favor ingrese un número ganador");
        return;
      }

      const result = await RaffleController.announceWinner(
        selectedRaffle.id,
        winningNumber
      );

      if (result.winner) {
        // Update the local state with winner information
        const updatedRaffle = {
          ...selectedRaffle,
          status: "finished",
          winner: winningNumber,
          winnerName: result.purchaser,
        };

        setRaffles(
          raffles.map((raffle) =>
            raffle.id === selectedRaffle.id ? updatedRaffle : raffle
          )
        );
        setSelectedRaffle(updatedRaffle);

        toast.error(
          `El ganador es el número ${winningNumber}, comprado por ${result.purchaser}`
        );
      } else {
        toast.error(`Nadie compró el número ${winningNumber}`);
      }

      setShowWinnerModal(false);
      setWinningNumber("");
    } catch (error) {
      console.error("Error announcing winner:", error);
      toast.error("Error al anunciar el ganador");
    }
  };

  const handleCreateRaffle = async () => {
    if (!raffleName || !raffleDescription || !rafflePrice || !raffleDate) {
      toast.error("Por favor complete todos los campos.");
      return;
    }

    try {
      const raffleData = {
        name: raffleName,
        description: raffleDescription,
        price: parseInt(rafflePrice),
        date: raffleDate,
        status: selectedRaffle?.status || "active",
        numbers: selectedRaffle?.numbers || {},
        winner: "",
        winnerName: "",
      };

      if (raffleImage) {
        raffleData.image = raffleImage;
      } else if (selectedRaffle) {
        raffleData.image = selectedRaffle.image;
      }

      if (selectedRaffle) {
        await RaffleController.updateRaffle(selectedRaffle.id, raffleData);
        console.log("Raffle updated with data:", raffleData);
      } else {
        await RaffleController.createRaffle(raffleData);
        console.log("Raffle created with data:", raffleData);
      }

      const fetchedRaffles = await RaffleController.getAllRaffles();
      const rafflesArray = Object.entries(fetchedRaffles || {}).map(
        ([id, raffle]) => ({
          id,
          ...raffle,
        })
      );
      setRaffles(rafflesArray);

      setShowCreateModal(false);
      setRaffleName("");
      setRaffleDescription("");
      setRafflePrice("");
      setRaffleDate("");
      setRaffleImage(null);
      setSelectedRaffle(null);

      toast.success(
        selectedRaffle
          ? "Rifa actualizada exitosamente"
          : "Rifa creada exitosamente"
      );
    } catch (error) {
      console.error("Error creating/updating raffle:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleSelectRaffle = (raffleId) => {
    const raffle = raffles.find((r) => r.id === raffleId);
    setSelectedRaffle(raffle);
  };

  const handleShowApproveModal = (number) => {
    setSelectedNumber(number);
    setShowApproveModal(true);
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRaffleImage(file);
    }
  };

  const resetForm = () => {
    setRaffleName("");
    setRaffleDescription("");
    setRafflePrice("");
    setRaffleDate("");
    setRaffleImage(null);
    setSelectedRaffle(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleDeleteRaffle = async () => {
    try {
      if (!selectedRaffle?.id) {
        throw new Error("No hay rifa seleccionada");
      }

      if (
        !confirm(
          "¿Está seguro que desea eliminar esta rifa? Esta acción no se puede deshacer."
        )
      ) {
        return;
      }

      await RaffleController.deleteRaffle(selectedRaffle.id);

      const fetchedRaffles = await RaffleController.getAllRaffles();
      setRaffles(Object.values(fetchedRaffles || {}));

      setSelectedRaffle(null);
      setShowDeleteModal(false);

      toast.success("Rifa eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting raffle:", error);
      toast.error(error.message);
    }
  };

  const handleEditClick = (raffle) => {
    setSelectedRaffle(raffle);
    setRaffleName(raffle.name);
    setRaffleDescription(raffle.description);
    setRafflePrice(raffle.price);
    setRaffleDate(raffle.date);
    setRaffleImage(null);
    setShowUpdateModal(true);
  };

  const handleUpdateRaffle = async () => {
    if (!raffleName || !raffleDescription || !rafflePrice || !raffleDate) {
      toast.error("Por favor complete todos los campos.");
      return;
    }

    try {
      const raffleData = {
        name: raffleName,
        description: raffleDescription,
        price: parseInt(rafflePrice),
        date: raffleDate,
        image: raffleImage,
        status: selectedRaffle.status,
        numbers: selectedRaffle.numbers,
        winner: "",
        winnerName: "",
      };

      await RaffleController.updateRaffle(selectedRaffle.id, raffleData);

      const fetchedRaffles = await RaffleController.getAllRaffles();
      const rafflesArray = Object.entries(fetchedRaffles || {}).map(
        ([id, raffle]) => ({
          id,
          ...raffle,
        })
      );
      setRaffles(rafflesArray);

      setShowUpdateModal(false);
      setRaffleName("");
      setRaffleDescription("");
      setRafflePrice("");
      setRaffleDate("");
      setRaffleImage(null);
      setSelectedRaffle(null);

      toast.success("Rifa actualizada exitosamente");
    } catch (error) {
      console.error("Error updating raffle:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleShowImageModal = (numberData) => {
    setSelectedPurchase(numberData);
    setShowImageModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Administración de Rifas</h1>
        <div className={styles.buttonContainer}>
          <Button variant="primary" size="lg" onClick={handleCreateClick}>
            Crear Nueva Rifa
          </Button>
          <Dropdown onSelect={handleSelectRaffle}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" size="lg">
              Seleccionar Rifa
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {raffles.map((raffle) => (
                <Dropdown.Item key={raffle.id} eventKey={raffle.id}>
                  {raffle.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {selectedRaffle ? (
        <div className={styles.raffle}>
          <div className={styles.raffleHeader}>
            <div className={styles.raffleInfo}>
              <div className={styles.raffleTitle}>
                <div>
                  <h2>
                    {selectedRaffle.name}
                    <span
                      className={`badge ${
                        selectedRaffle.status === "active"
                          ? "bg-success"
                          : "bg-secondary"
                      } ms-2`}
                    >
                      {selectedRaffle.status === "active"
                        ? "Activa"
                        : "Finalizada"}
                    </span>
                  </h2>
                </div>
              </div>
              <p>
                <strong>Descripción:</strong> {selectedRaffle.description}
              </p>
              <p>
                <strong>Precio:</strong> ₡{formatNumber(selectedRaffle.price)}
              </p>
              <p>
                <strong>Fecha:</strong> {selectedRaffle.date}
              </p>
              <div className={styles.actionButtons}>
                <Button
                  variant="outline-primary"
                  className={styles.actionButton}
                  onClick={() => handleEditClick(selectedRaffle)}
                >
                  <Pencil size={16} /> Editar
                </Button>
                <Button
                  variant="outline-danger"
                  className={styles.actionButton}
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={16} /> Eliminar
                </Button>
              </div>
            </div>
            {selectedRaffle.image && (
              <div className={styles.raffleImageContainer}>
                <img
                  src={selectedRaffle.image}
                  alt={selectedRaffle.name}
                  className={styles.raffleImage}
                />
              </div>
            )}
          </div>

          {selectedRaffle.status === "finished" && (
            <div className="alert alert-info">
              <Trophy size={20} className="me-2" />
              Número Ganador: {selectedRaffle.winner || "No establecido"}
              {selectedRaffle.winnerName &&
                ` - Ganador: ${selectedRaffle.winnerName}`}
            </div>
          )}
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr>
                <th>Número</th>
                <th>Estado</th>
                <th>Comprador</th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 100 }, (_, i) => {
                const number = i;
                const data = selectedRaffle.numbers[number] || {
                  number,
                  buyer: "",
                  id: "",
                  phone: "",
                  receipt: "",
                  status: "available",
                  purchased: false,
                  approved: false,
                };

                return (
                  <tr key={number}>
                    <td>{number}</td>
                    <td>
                      {data.status === "approved"
                        ? "Aprobado"
                        : data.status === "pending"
                        ? "Pendiente"
                        : data.status === "rejected"
                        ? "Rechazado"
                        : "Disponible"}
                    </td>
                    <td>{data.buyer || "N/A"}</td>
                    <td>{data.id || "N/A"}</td>
                    <td>{data.phone || "N/A"}</td>
                    <td>
                      {data.purchased && (
                        <Button
                          variant="outline-primary"
                          className={styles.btn}
                          onClick={() => handleShowImageModal(data)}
                        >
                          <Check size={16} />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {selectedRaffle.status === "active" && (
            <Button
              variant="outline-primary"
              className={styles.btn}
              onClick={() => setShowWinnerModal(true)}
            >
              <Trophy size={16} /> Anunciar Ganador
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center text-muted mt-5">
          <h3>Seleccione una rifa para ver sus detalles</h3>
        </div>
      )}

      <Modal show={showCreateModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Rifa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="raffleName" className={styles.formGroup}>
            <Form.Label>Nombre de la Rifa</Form.Label>
            <Form.Control
              type="text"
              value={raffleName}
              onChange={(e) => setRaffleName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group
            controlId="raffleDescription"
            className={styles.formGroup}
          >
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={raffleDescription}
              onChange={(e) => setRaffleDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="rafflePrice" className={styles.formGroup}>
            <Form.Label>Precio de los Números</Form.Label>
            <Form.Control
              type="number"
              value={rafflePrice}
              onChange={(e) => setRafflePrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="raffleDate" className={styles.formGroup}>
            <Form.Label>Fecha de la Rifa</Form.Label>
            <Form.Control
              type="date"
              value={raffleDate}
              onChange={(e) => setRaffleDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="raffleImage" className={styles.formGroup}>
            <Form.Label>Imagen</Form.Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Button
              variant="secondary"
              onClick={handleFileInputClick}
              className={styles.imageButton}
            >
              Adjuntar Imagen
            </Button>
            {raffleImage && (
              <p className={styles.tabbed}>
                Imagen adjuntada: {raffleImage.name}
              </p>
            )}
            {selectedRaffle && selectedRaffle.image && !raffleImage && (
              <div className={styles.currentImage}>
                <p>Imagen actual:</p>
                <img
                  src={selectedRaffle.image}
                  alt="Current"
                  className={styles.thumbnailImage}
                />
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateRaffle}>
            Crear Rifa
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWinnerModal} onHide={() => setShowWinnerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Anunciar Ganador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="winningNumber">
            <Form.Label>Número Ganador</Form.Label>
            <Form.Control
              type="number"
              value={winningNumber}
              onChange={(e) => setWinningNumber(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWinnerModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAnnounceWinner}>
            Anunciar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aprobar Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNumber && (
            <div className={styles.approveModalBody}>
              <p>
                <strong>Número:</strong> {selectedNumber.number}
              </p>
              <p>
                <strong>Comprador:</strong> {selectedNumber.purchaser}
              </p>
              <p>
                <strong>Cédula:</strong> {selectedNumber.cedula}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedNumber.phone}
              </p>
              {selectedNumber.image && (
                <div>
                  <p>
                    <strong>Comprobante:</strong>
                  </p>
                  <img
                    src={selectedNumber.image}
                    alt="Comprobante"
                    className={styles.proofImage}
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowApproveModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={16} /> Borrar
          </Button>
          <Button variant="primary" onClick={handleApprove}>
            Aprobar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro que desea eliminar la rifa "{selectedRaffle?.name}"?
          </p>
          <p className="text-danger">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteRaffle}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Rifa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={raffleName}
                onChange={(e) => setRaffleName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                value={raffleDescription}
                onChange={(e) => setRaffleDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={rafflePrice}
                onChange={(e) => setRafflePrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={raffleDate}
                onChange={(e) => setRaffleDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setRaffleImage(e.target.files[0])}
              />
              {selectedRaffle?.image && (
                <div className={styles.modalImageContainer}>
                  <img
                    src={selectedRaffle.image}
                    alt="Current"
                    className={styles.modalImage}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateRaffle}>
            Actualizar Rifa
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Verificar Comprobante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPurchase && (
            <div className={styles.modalContent}>
              <div className={styles.purchaseInfo}>
                <p>
                  <strong>Número:</strong> {selectedPurchase.number}
                </p>
                <p>
                  <strong>Comprador:</strong> {selectedPurchase.buyer}
                </p>
                <p>
                  <strong>Cédula:</strong> {selectedPurchase.id}
                </p>
                <p>
                  <strong>Teléfono:</strong> {selectedPurchase.phone}
                </p>
              </div>
              {selectedPurchase.receipt && (
                <div className={styles.receiptImage}>
                  <img
                    src={selectedPurchase.receipt}
                    alt="Comprobante"
                    className={styles.modalImage}
                  />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Rechazar
          </Button>
          <Button variant="success" onClick={handleApprove}>
            Aprobar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RafflesPage;
