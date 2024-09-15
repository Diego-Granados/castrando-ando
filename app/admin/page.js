"use client";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import Pagination from "react-bootstrap/Pagination";
import CampaignCard from "@/components/CampaignCard";
import { db } from "@/lib/firebase/config";
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

export default function Home() {
  const campaignsRef = ref(db, "campaigns");
  const [campaigns, setCampaigns] = useState({});
  const [activePage, setActivePage] = useState(1);
  const campaignsPerPage = 1; // Número de campañas por página

  const [currentCampaigns, setCurrentCampaigns] = useState(null);
  const [items, setItems] = useState(null);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    const unsubscribe = onValue(campaignsRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data available");
        return;
      }
      const data = snapshot.val();
      Object.keys(data).forEach((campaign) => {
        console.log(data[campaign].enabled);
        if (!data[campaign].enabled) delete data[campaign];
      });
      setCampaigns(data);

      const LastperPage = activePage * campaignsPerPage;
      const FirstperPage = LastperPage - campaignsPerPage;

      const currentCampaigns = Object.keys(data)
        .reverse()
        .slice(FirstperPage, LastperPage);

      setCurrentCampaigns(currentCampaigns);
      /* Esto sirve para generar la cantidad de botones*/
      const totalPages = Math.ceil(Object.keys(data).length / campaignsPerPage);
      setTotalPages(totalPages);
      const items = [];
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === activePage}
            onClick={() => setActivePage(number)}
          >
            {number}
          </Pagination.Item>
        );
      }
      setItems(items);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="container">
      <h1>Asociación Animalitos Abandonados</h1>
      {items ? (
        <>
          <div className="d-flex justify-content-center">
            {/* Mostrar las campañas de la página actual */}
            {currentCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign}
                campaign={{ campaign, ...campaigns[campaign] }}
                admin={true}
              />
            ))}
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <Pagination size="sm">
              <Pagination.First onClick={() => setActivePage(1)} />
              <Pagination.Prev
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
              />
              {items}
              <Pagination.Next
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages))
                }
              />
              <Pagination.Last onClick={() => setActivePage(totalPages)} />
            </Pagination>
          </div>
        </>
      ) : (
        <h2> No hay campañas disponibles </h2>
      )}

      <Row className="d-flex justify-content-center">
        <Col className="d-flex justify-content-center">
          <Link href="/admin/crear">Crear campañas</Link>
        </Col>
      </Row>
    </main>
  );
}
