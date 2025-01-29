"use client";
import Campaign from "@/models/Campaign";
import AuthController from "@/controllers/AuthController";
import { NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import Medicine from "@/models/Medicine";

class CampaignController {
  static async getAllCampaigns(setCampaigns) {
    const unsubscribe = await Campaign.getAll(setCampaigns);
    return unsubscribe;
  }

  static async getCampaignById(campaignId, setCampaign) {
    const unsubscribe = await Campaign.getById(campaignId, setCampaign);
    return unsubscribe;
  }

  static async getCampaignByIdOnce(campaignId, setCampaign) {
    await Campaign.getByIdOnce(campaignId, setCampaign);
  }

  static async verifyRole() {
    const { user, role } = await AuthController.getCurrentUser();
    if (role !== "Admin") {
      throw new Error("User is not an admin");
    }
  }

  static async createCampaign(formData) {
    try {
      await CampaignController.verifyRole();
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

  static async updateCampaign(formData) {
    try {
      await CampaignController.verifyRole();
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
    }
    try {
      const campaignId = formData.campaignId;
      const updates = {};
      updates[`/campaigns/${campaignId}/title`] = formData.title;
      updates[`/campaigns/${campaignId}/date`] = formData.date;
      updates[`/campaigns/${campaignId}/description`] = formData.description;
      updates[`/campaigns/${campaignId}/phone`] = formData.phone;
      updates[`/campaigns/${campaignId}/place`] = formData.place;
      updates[`/campaigns/${campaignId}/pricesData`] = formData.pricesData;
      updates[`/campaigns/${campaignId}/priceSpecial`] = formData.priceSpecial;
      updates[`/campaigns/${campaignId}/requirements`] = formData.requirements;

      if (formData.photos.length > 0) {
        updates[`/campaigns/${campaignId}/photos`] = formData.photos;
      }
      await Campaign.update(campaignId, updates, {
        title: formData.title,
        date: formData.date,
        place: formData.place,
      });
      return NextResponse.json({ message: "Form data saved successfully!" });
    } catch (error) {
      console.log(error);
      console.error(error);
      return NextResponse.error(error);
    }
  }

  static async deleteCampaign(formData) {
    try {
      await CampaignController.verifyRole();
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
    }
    try {
      const campaignId = formData.campaignId;
      await Campaign.delete(campaignId);
      const photos = formData.photos;
      const deleteResponse = await fetch("/api/storage/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: photos }),
      });
      if (!deleteResponse.ok) {
        throw new Error("Failed to delete old files");
      }
      return NextResponse.json({ message: "Campaign deleted successfully!" });
    } catch (error) {
      return NextResponse.error(error);
    }
  }

  static async calculateMedicineNeeds(campaignId) {
    try {
      let totals = [];
      const totalWeight = await Campaign.getInscriptionsWeight(campaignId);
      const medicines = await Medicine.getAllOnce();
      for (const medicine of medicines) {
        if (medicine.weightMultiplier === 0) {
          throw new Error("Division by 0");
        }
        totals.push({
          name: medicine.name,
          total: Math.ceil(
            medicine.amount *
              Math.floor(totalWeight / medicine.weightMultiplier) *
              medicine.daysOfTreatment
          ),
          unit: medicine.unit,
        });
      }
      return totals;
    } catch (error) {
      console.error("Error calculating medicine needs:", error);
      throw error;
    }
  }
}

export default CampaignController;
