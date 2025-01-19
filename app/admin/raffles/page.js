"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Dropdown } from "react-bootstrap";
import { Check, Trophy, Trash2 } from "lucide-react";
import RaffleController from "@/controllers/RaffleController";
import styles from "./RafflesPage.module.css";

const RafflesPage = () => {
  const [raffles, setRaffles] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [raffleName, setRaffleName] = useState("");
  const [winningNumber, setWinningNumber] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(null);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const fetchedRaffles = await RaffleController.getAllRaffles();
        setRaffles(Object.values(fetchedRaffles));
      } catch (error) {
        console.error("Error fetching raffles:", error);
      }
    };
    fetchRaffles();
  }, []);

  const handleApprove = async () => {
    try {
      await RaffleController.approvePurchase(
        selectedRaffle.id,
        selectedNumber.number
      );
      const fetchedRaffles = await RaffleController.getAllRaffles();
      setRaffles(Object.values(fetchedRaffles));
      setShowApproveModal(false);
    } catch (error) {
      console.error("Error approving purchase:", error);
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
      const result = await RaffleController.announceWinner(
        selectedRaffle.id,
        parseInt(winningNumber, 10)
      );
      if (result.winner) {
        alert(
          `El ganador es el número ${winningNumber}, comprado por ${result.purchaser}`
        );
      } else {
        alert(`Nadie compró el número ${winningNumber}`);
      }
      await RaffleController.updateRaffle(selectedRaffle.id, {
        status: "finished",
      });
      const fetchedRaffles = await RaffleController.getAllRaffles();
      setRaffles(Object.values(fetchedRaffles));
      setShowWinnerModal(false);
      setWinningNumber("");
    } catch (error) {
      console.error("Error announcing winner:", error);
    }
  };

  const handleCreateRaffle = async () => {
    const newRaffle = {
      id: Date.now().toString(),
      name: raffleName,
      status: "active",
      numbers: Array.from({ length: 100 }, (_, number) => ({
        number,
        purchased: false,
        purchaser: null,
        image: null,
      })),
    };
    try {
      await RaffleController.createOrUpdateRaffle(newRaffle);
      const fetchedRaffles = await RaffleController.getAllRaffles();
      setRaffles(Object.values(fetchedRaffles));
      setShowCreateModal(false);
      setRaffleName("");
    } catch (error) {
      console.error("Error creating raffle:", error);
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

  return (
    <div className={styles.container}>
      <h1>Rifas</h1>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Crear Nueva Rifa
      </Button>
      <Dropdown onSelect={handleSelectRaffle}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
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
      {selectedRaffle && (
        <div className={styles.raffle}>
          <h2>
            {selectedRaffle.name} (
            {selectedRaffle.status === "active" ? "Activa" : "Finalizada"})
          </h2>
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr>
                <th>Número</th>
                <th>Comprado</th>
                <th>Comprador</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 100 }, (_, number) => (
                <tr key={number}>
                  <td>{number}</td>
                  <td>
                    {selectedRaffle.numbers[number]?.purchased ? "Sí" : "No"}
                  </td>
                  <td>{selectedRaffle.numbers[number]?.purchaser || "N/A"}</td>
                  <td>
                    {selectedRaffle.numbers[number]?.purchased && (
                      <Button
                        variant="outline-success"
                        className={styles.btn}
                        onClick={() =>
                          handleShowApproveModal(selectedRaffle.numbers[number])
                        }
                      >
                        <Check size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
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
      )}

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Rifa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="raffleName">
            <Form.Label>Nombre de la Rifa</Form.Label>
            <Form.Control
              type="text"
              value={raffleName}
              onChange={(e) => setRaffleName(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateRaffle}>
            Crear
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
            <>
              <img
                src={selectedNumber.image}
                alt="Comprobante"
                className={styles.proofImage}
              />
              <p>Comprador: {selectedNumber.purchaser}</p>
            </>
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
    </div>
  );
};

export default RafflesPage;
