import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { ref, push, update } from "firebase/database";

// POST /api/campaigns/create
// Crea una nueva campaña
export async function PUT(req) {
  try {
    const { formData } = await req.json();
    console.log(formData);
    formData["available"] = 70;
    formData["enabled"] = true;

    // Configuración de los horarios de inscripción.
    // Hay citas de 8 a 2pm con 10 cupos disponibles cada hora.
    const inscriptions = {
      "08:00": { available: 10 },
      "09:00": { available: 10 },
      "10:00": { available: 10 },
      "11:00": { available: 10 },
      "12:00": { available: 10 },
      "13:00": { available: 10 },
      "14:00": { available: 10 },
    };
    const campaignRef = ref(db, "campaigns");
    const newCampaignRef = push(campaignRef);
    const updates = {};
    updates[`/campaigns/${newCampaignRef.key}`] = formData;
    updates[`/inscriptions/${newCampaignRef.key}`] = inscriptions;
    // Insertar en DB
    await update(ref(db), updates);
    return NextResponse.json({ message: "Form data saved successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
