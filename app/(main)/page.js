"use client";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import CampaignCard from "@/components/CampaignCard";
import { db } from "@/lib/firebase/config";
import { ref, onValue } from "firebase/database";
import { useState } from "react";
export default function Home() {
  const campaignsRef = ref(db, "campaigns");
  const [campaigns, setCampaigns] = useState({});

  onValue(
    campaignsRef,
    (snapshot) => {
      console.log(snapshot.val());
      setCampaigns(snapshot.val());
    },
    { onlyOnce: true }
  );

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
