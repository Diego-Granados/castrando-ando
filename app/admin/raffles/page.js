"use client";

import React, { useState } from "react";
import styles from "./RafflesPage.module.css";
import { Button, Table } from "react-bootstrap";
import { Check } from "lucide-react";

const RafflesPage = () => {
  const [raffles, setRaffles] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      number: i,
      purchased: false,
      purchaser: null,
    }))
  );

  const handleApprove = (number) => {
    const purchaser = prompt("Ingrese el nombre del comprador:");
    if (purchaser) {
      setRaffles(
        raffles.map((raffle) =>
          raffle.number === number
            ? { ...raffle, purchased: true, purchaser }
            : raffle
        )
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1>Rifas</h1>
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
          {raffles.map((raffle) => (
            <tr key={raffle.number}>
              <td>{raffle.number}</td>
              <td>{raffle.purchased ? "Sí" : "No"}</td>
              <td>{raffle.purchaser || "N/A"}</td>
              <td>
                {!raffle.purchased && (
                  <Button
                    variant="outline-success"
                    className={styles.btn}
                    onClick={() => handleApprove(raffle.number)}
                  >
                    <Check size={16} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RafflesPage;
