"use client";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { ref, push, update } from "firebase/database";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// PUT /api/campaigns/create
// Crea una nueva campaña
export async function uploadCampaign(formData) {
  try {
    let user = null;
    // Use onAuthStateChanged to get the current user
    await new Promise((resolve) => {
      onAuthStateChanged(auth, (currentUser) => {
        user = currentUser;
        resolve(); // Resolve the promise when the user is available
      });
    });

    if (!user) {
      console.log("User not authenticated");
      return NextResponse.error("User not authenticated", { status: 401 });
    }

    // const { formData } = await req.json();
    console.log(formData);
    formData["available"] = 85;
    formData["enabled"] = true;

    // Configuración de los horarios de inscripción.
    // Hay citas de 8 a 2pm con 10 cupos disponibles cada hora.
    const inscriptions = {
      "07:30": { available: 5 },
      "08:00": { available: 10 },
      "09:00": { available: 10 },
      "10:00": { available: 10 },
      "11:00": { available: 10 },
      "12:00": { available: 10 },
      "13:00": { available: 10 },
      "14:00": { available: 10 },
      "15:00": { available: 10 },
    };
    const campaignRef = ref(db, "campaigns");
    const newCampaignRef = push(campaignRef);
    const updates = {};
    updates[`/campaigns/${newCampaignRef.key}`] = formData;
    //updates[`/inscriptions/${newCampaignRef.key}`] = inscriptions;
    // Insertar en DB
    await update(ref(db), updates);
    return NextResponse.json({ message: "Form data saved successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
