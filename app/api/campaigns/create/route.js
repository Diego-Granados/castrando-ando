"use client";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { ref, push, update } from "firebase/database";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Función para generar los horarios de inscripción
function generateInscriptions(startTime, endTime, slotsNumber) {
  // Función para añadir minutos a una hora
  const addMinutes = (timeStr, minutes) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toTimeString().slice(0, 5);
  };

  let inscriptions = {};
  let totalAvailableSlots = 0; // Contador de los espacios disponibles
  let currentTime = startTime;

  // Obtener la hora y los minutos de la hora de inicio
  const [startHour, startMinute] = currentTime.split(":").map(Number);
  let isHalfHour = startMinute === 30; // Verificar si la hora de inicio es media hora

  while (currentTime <= endTime) {
    if (isHalfHour) {
      // Asignar la mitad de los espacios a las horas de media hora
      const halfSlots = Math.floor(slotsNumber / 2);
      inscriptions[currentTime] = { available: halfSlots };
      totalAvailableSlots += halfSlots; // Añadir la mitad de los espacios al total
      // Mover a la siguiente hora
      currentTime = addMinutes(currentTime, 30);
    } else {
      // Asignar la cantidad completa de espacios a las horas completas
      inscriptions[currentTime] = { available: slotsNumber };
      totalAvailableSlots += slotsNumber; // Añadir la cantidad completa de espacios al total
      // Mover a la siguiente hora
      currentTime = addMinutes(currentTime, 60);
    }

    // Cambiar el estado de la variable isHalfHour
    isHalfHour = false;
  }
  return {
    inscriptions,
    totalAvailableSlots,
  };
}

// Crea una nueva campaña
export async function createCampaign(formData) {
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
      return NextResponse.error("User not authenticated", { status: 401 });
    }

    const slotsNumber = parseInt(formData["slotsNumber"], 10);

    // Configuración de los horarios de inscripción.
    const { inscriptions, totalAvailableSlots } = generateInscriptions(
      formData["startTime"],
      formData["endTime"],
      slotsNumber
    );

    formData["available"] = totalAvailableSlots;
    formData["enabled"] = true;
    const campaignRef = ref(db, "campaigns");
    const newCampaignRef = push(campaignRef);
    const updates = {};
    updates[`/campaigns/${newCampaignRef.key}`] = formData;
    updates[`/inscriptions/${newCampaignRef.key}`] = inscriptions;
    // Insertar en DB
    await update(ref(db), updates);
    return NextResponse.json({ message: "Form data saved successfully!" });
  } catch (error) {
    return NextResponse.error(error);
  }
}
