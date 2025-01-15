"use client";

import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Pencil, Send, Trash2 } from "lucide-react";
import styles from "./RafflesPage.module.css";
import { Check } from "@mui/icons-material";

const RafflesPage = () => {
  const [raffles, setRaffles] = useState(
    Array.from({ length: 1000 }, (_, i) => ({
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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Número</th>
            <th>Estado</th>
            <th>Comprador</th>
            <th>Cédula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {raffles.map((raffle) => (
            <tr key={raffle.number}>
              <td>{raffle.number}</td>
              <td>{raffle.purchased ? "Comprado" : "Disponible"}</td>
              <td>{raffle.purchaser || "N/A"}</td>
              <td>{raffle.purchaser ? "12345678" : "N/A"}</td>
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
      </table>
    </div>
  );
};

export default RafflesPage;
