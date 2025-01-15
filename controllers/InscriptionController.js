"use client";
import Inscription from "@/models/Inscription";
import { NextResponse } from "next/server";
import {
  sendConfirmationEmail,
  sendCancelEmail,
} from "@/controllers/EmailSenderController";

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
      // await Inscription.reserveAppointment(formData, authenticated);
      const emailResponse = await sendConfirmationEmail(
        formData.email,
        formData.name,
        formData.timeslot,
        formData.date,
        formData.campaign + " en " + formData.place
      );
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
        formData.campaign + " en " + formData.place
      );
      return NextResponse.json({ message: "Appointment deleted correctly!" });
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
}

export default InscriptionController;
