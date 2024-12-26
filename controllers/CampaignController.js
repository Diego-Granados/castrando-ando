"use client";
import Campaign from "@/models/Campaign";
import AuthController from "@/controllers/AuthController";
import { NextResponse } from "next/server";
class CampaignController {
  static async getAllCampaigns(setCampaigns) {
    const unsubscribe = await Campaign.getAll(setCampaigns);
    return unsubscribe;
  }

  static async getCampaignById(campaignId, setCampaign) {
    const unsubscribe = await Campaign.getById(campaignId, setCampaign);
    return unsubscribe;
  }

  static async createCampaign(formData) {
    console.log(formData);
    try {
      const { user, role } = await AuthController.getCurrentUser();
      if (role !== "Admin") {
        throw new Error("User is not an admin");
      }
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
    }
    try {
      const slotsNumber = parseInt(formData["slotsNumber"], 10);

      // Configuración de los horarios de inscripción.
      const { inscriptions, totalAvailableSlots } =
        CampaignController.generateInscriptions(
          formData["startTime"],
          formData["endTime"],
          slotsNumber
        );

      formData["available"] = totalAvailableSlots;
      formData["enabled"] = true;

      Campaign.create(formData, inscriptions);
      console.log("CREATED");
      return NextResponse.json({ message: "Form data saved successfully!" });
    } catch (error) {
      console.log(error);
      return NextResponse.error(error);
    }
  }

  // Función para generar los horarios de inscripción
  static generateInscriptions(startTime, endTime, slotsNumber) {
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
}

export default CampaignController;
