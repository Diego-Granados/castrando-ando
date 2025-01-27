"use client";
import Campaign from "@/models/Campaign";
import AuthController from "@/controllers/AuthController";
import { NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import NotificationController from "@/controllers/NotificationController";

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
    try {
      const { user, role } = await AuthController.getCurrentUser();
      if (role !== "Admin") {
        throw new Error("User is not an admin");
      }
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
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

      const campaignId = await Campaign.create(formData, inscriptions);
      
      // Send notification to all users about the new campaign
      await NotificationController.sendNotificationToAllUsers({
        title: "¡Nueva Campaña de Castración!",
        message: `Nueva campaña: ${formData.title} el ${formData.date}. Lugar: ${formData.place}. ¡Reserva tu cupo!`,
        type: "campaign",
        link: `/campaign?id=${campaignId}`,
        campaignId: campaignId
      });

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

      await Campaign.update(campaignId, updates);

      await NotificationController.sendCampaignNotification({
        title: "¡Actualización de Campaña!",
        message: `La campaña "${formData.title}" ha sido actualizada. Fecha: ${formData.date}. Lugar: ${formData.place}. Por favor revisa los detalles.`,
        type: "campaign_update",
        link: `/campaign?id=${campaignId}`,
        campaignId: campaignId
      });

      return NextResponse.json({ message: "Form data saved successfully!" });
    } catch (error) {
      return NextResponse.error(error);
    }
  }

  static async deleteCampaign(formData) {
    let campaign = null;
    
    try {
      await CampaignController.verifyRole();
    } catch (error) {
      return NextResponse.error("User not authenticated", { status: 401 });
    }
    try {
      const campaignId = formData.campaignId;

      const setCampaign = (data) => {
        campaign = data;
      };

      await Campaign.getByIdOnce(campaignId, setCampaign); 
      
      // Delete campaign and photos
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

      // Send notification to all campaign participants
      await NotificationController.sendCampaignNotification({
        title: "¡Campaña Cancelada!",
        message: `La campaña "${campaign.title}" programada para el ${campaign.date} ha sido cancelada.`,
        type: "campaign_cancellation",
        link: `/campaigns`,
        campaignId: campaignId
      });

      return NextResponse.json({ message: "Campaign deleted successfully!" });
    } catch (error) {
      return NextResponse.error(error);
    }
  }

  static async calculateMedicineNeeds(campaignId) {
    try {
      return await Campaign.getInscriptionsWeight(campaignId);
    } catch (error) {
      console.error("Error calculating medicine needs:", error);
      throw error;
    }
  }
}

export default CampaignController;
