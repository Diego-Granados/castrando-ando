"use client";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import Pagination from 'react-bootstrap/Pagination'
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

  useEffect(() => {
    const unsubscribe = onValue(campaignsRef, (snapshot) => {
      setCampaigns(snapshot.val());
    });

    return () => unsubscribe();
  }, []);

  const LastperPage = activePage * campaignsPerPage;
  const FirstperPage = LastperPage - campaignsPerPage;

  const currentCampaigns = Object.keys(campaigns)
    .reverse()
    .slice(FirstperPage, LastperPage);

  {/* Esto sirve para generar la cantidad de botones*/}
  const totalPages = Math.ceil(Object.keys(campaigns).length / campaignsPerPage);   

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

  return (
    <main className="container">
      <h1>Asociación Animalitos Abandonados</h1>
      <div className="d-flex justify-content-center align-items-center">
        {/* Mostrar las campañas de la página actual */}
          {currentCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign}
              campaign={{ campaign, ...campaigns[campaign] }}
            />
          ))}
      </div>
      <div className="d-flex justify-content-center align-items-center">
        
        <Pagination size="sm">
          <Pagination.First onClick={() => setActivePage(1)} />
          <Pagination.Prev onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}/>
            {items}
          <Pagination.Next onClick={() => setActivePage(prev => Math.min(prev + 1, totalPages))}/>
          <Pagination.Last  onClick={() => setActivePage(totalPages)}/>
        </Pagination>
      </div>
      <Link href="adminlogin">Ingresar como administrador</Link>
    </main>
  );
}
