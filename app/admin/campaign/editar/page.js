"use client";
import EditForm from "./EditForm";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import CampaignController from "@/controllers/CampaignController";

export default function Edit() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [campaign, setCampaign] = useState(null);
  const router = useRouter();
  if (!campaignId) {
    router.push("/admin");
  }

  const { loading, error } = useSubscription(() =>
    CampaignController.getCampaignById(campaignId, setCampaign)
  );

  return (
    <main className="container">
      <h1>Editar campaña</h1>
      {campaign && <EditForm campaign={campaign} campaignId={campaignId} />}
    </main>
  );
}
