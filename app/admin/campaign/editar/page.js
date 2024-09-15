"use client";
import EditForm from "./EditForm";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Edit() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [campaign, setCampaign] = useState(null);
  const router = useRouter();
  if (!campaignId) {
    router.push("/admin");
  }

  useEffect(() => {
    console.log("campaignId", campaignId);
    const campaignRef = ref(db, `campaigns/${campaignId}`);

    const unsubscribe = onValue(campaignRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data available");
        return;
      }
      const value = snapshot.val();
      setCampaign(value);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <main className="container">
      <h1>Editar campaña</h1>
      {campaign && <EditForm campaign={campaign} campaignId={campaignId} />}
    </main>
  );
}
