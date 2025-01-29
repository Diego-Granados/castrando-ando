"use client";
import Inscription from "@/models/Inscription";
import { NextResponse } from "next/server";
import {
  sendConfirmationEmail,
  sendCancelEmail,
} from "@/controllers/EmailSenderController";
import NotificationController from "@/controllers/NotificationController";
import UserActivityController from "@/controllers/UserActivityController";

class InscriptionController {
  static async getCampaignInscriptions(
    campaignId,
    setSortedKeys,
    setTimeslots
  ) {
    const unsubscribe = await Inscription.getCampaignInscriptions(
      campaignId,
      setSortedKeys,
      setTimeslots
    );
    return unsubscribe;
  }

  static async getAvailableTimeslots(campaignId, timeslot, setAvailable) {
    const unsubscribe = await Inscription.getAvailableTimeslots(
      campaignId,
      timeslot,
      setAvailable
    );
    return unsubscribe;
  }

  static async reserveAppointment(formData, authenticated) {
    try {
      const appointmentKey = await Inscription.reserveAppointment(
        formData,
        authenticated
      );
      const emailResponse = await sendConfirmationEmail(
        formData.email,
        formData.name,
        formData.timeslot,
        formData.date,
        formData.campaign + " en " + formData.place,
        formData.campaignId,
        appointmentKey
      );

      // Create notification for the user
      await NotificationController.createNotification({
        title: "¡Cita Reservada!",
        message: `Has reservado una cita para ${formData.campaign} en ${formData.place}. Fecha: ${formData.date}, Hora: ${formData.timeslot}.`,
        type: "appointment",
        link: `/appointments`,
        userId: formData.id,
        campaignId: formData.campaignId,
      });

      // Register user activity for campaign signup
      await UserActivityController.registerActivity({
        type: "CAMPAIGN_SIGNUP",
        description: `Reservó una cita para ${formData.campaign} en ${formData.place}`,
        metadata: {
          campaignId: formData.campaignId,
          appointmentKey: appointmentKey,
          date: formData.date,
          timeslot: formData.timeslot,
        },
      });

      return NextResponse.json({
        message: "Appointment saved correctly!",
        emailResponse: emailResponse,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.error(error);
    }
  }

  static async getAppointments(cedula, setAppointments) {
    await Inscription.getAppointments(cedula, setAppointments);
  }

  static async updateAppointment(formData, authenticated) {
    try {
      await Inscription.updateAppointment(formData, authenticated);
      return NextResponse.json({ message: "Appointment updated correctly!" });
    } catch (error) {
      console.error(error);
      return NextResponse.error(error);
    }
  }

  static async deleteAppointment(formData) {
    try {
      await Inscription.deleteAppointment(formData);
      const emailResponse = await sendCancelEmail(
        formData.email,
        formData.name,
        formData.timeslot,
        formData.date,
        formData.campaign
      );
      // Create notification for the user
      await NotificationController.createNotification({
        title: "Cita Cancelada",
        message: `Tu cita para ${formData.campaign} del día ${formData.date} a las ${formData.timeslot} ha sido cancelada.`,
        type: "appointment_cancellation",
        link: `/campaign?id=${formData.campaignId}`,
        userId: formData.id,
        campaignId: formData.campaignId,
      });

      return NextResponse.json({
        message: "Appointment deleted correctly!",
        emailResponse: emailResponse,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.error(error);
    }
  }

  static async updateAttendance(campaignId, timeslot, inscriptionId, present) {
    try {
      await Inscription.updateAttendance(
        campaignId,
        timeslot,
        inscriptionId,
        present
      );
      return NextResponse.json({ message: "Attendance updated correctly!" });
    } catch (error) {
      console.error(error);
      return NextResponse.error(error);
    }
  }

  static async getCampaignParticipants(campaignId) {
    try {
      return await Inscription.getCampaignParticipants(campaignId);
    } catch (error) {
      console.error("Error getting campaign participants:", error);
      throw error;
    }
  }
}

export default InscriptionController;
