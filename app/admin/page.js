"use client";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import Pagination from "react-bootstrap/Pagination";
import CampaignCard from "@/components/CampaignCard";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import CampaignController from "@/controllers/CampaignController";
import useSubscription from "@/hooks/useSubscription";

export default function Home() {
  const [campaigns, setCampaigns] = useState({});
  const [activePage, setActivePage] = useState(1);
  const campaignsPerPage = 1; // Número de campañas por página

  const [currentCampaigns, setCurrentCampaigns] = useState(null);
  const [items, setItems] = useState(null);
  const [totalPages, setTotalPages] = useState(null);

  const { loading, error } = useSubscription(() =>
    CampaignController.getAllCampaigns(setCampaigns)
  );

  useEffect(() => {
    const LastperPage = activePage * campaignsPerPage;
    const FirstperPage = LastperPage - campaignsPerPage;
    const sortedCampaignKeys = Object.keys(campaigns).sort((a, b) => {
      return new Date(campaigns[b].date) - new Date(campaigns[a].date);
    });

    const currentCampaigns = sortedCampaignKeys.slice(
      FirstperPage,
      LastperPage
    );

    setCurrentCampaigns(currentCampaigns);

    /* Esto sirve para generar la cantidad de botones*/
    const totalPages = Math.ceil(
      Object.keys(campaigns).length / campaignsPerPage
    );
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
  }, [activePage, campaigns]);

  return (
    <main className="container">
      <h1>Asociación Castrando Ando</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : items ? (
        <>
          <div className="d-flex justify-content-center mt-5">
            {currentCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign}
                campaign={campaigns[campaign]}
                admin={true}
              />
            ))}
          </div>
          <div className="d-flex justify-content-center align-items-center mt-3">
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
        <Col className="d-flex justify-content-center gap-3">
          <Link href="/admin/crear">Crear campañas</Link>
          <Link href="/admin/medicines">Configurar Medicamentos</Link>
        </Col>
      </Row>
    </main>
  );
}
