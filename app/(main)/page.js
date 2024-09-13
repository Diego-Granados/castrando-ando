"use client";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import CampaignCard from "@/components/CampaignCard";
import { db } from "@/lib/firebase/config";
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
export default function Home() {
  const campaignsRef = ref(db, "campaigns");
  const [campaigns, setCampaigns] = useState({});

  useEffect(() => {
    const unsubscribe = onValue(
      campaignsRef,
      (snapshot) => {
        setCampaigns(snapshot.val());
      },
      { onlyOnce: true }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="container">
      <h1>Asociación Animalitos Abandonados</h1>
      {Object.keys(campaigns)
        .reverse()
        .map((campaign) => {
          return (
            <CampaignCard campaign={{ campaign, ...campaigns[campaign] }} />
          );
        })}
      {/* <CampaignCard />  */}
      <Link href="adminlogin">Ingresar como administrador</Link>
    </main>
  );
}
