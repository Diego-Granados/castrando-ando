import InscriptionController from "@/controllers/InscriptionController";
import Inscription from "@/models/Inscription";
import { NextResponse } from "next/server";
import {
  sendConfirmationEmail,
  sendCancelEmail,
} from "@/controllers/EmailSenderController";
import NotificationController from "@/controllers/NotificationController";
import UserActivityController from "@/controllers/UserActivityController";

// Mock dependencies
jest.mock("@/models/Inscription");
jest.mock("@/controllers/EmailSenderController");
jest.mock("@/controllers/NotificationController");
jest.mock("@/controllers/UserActivityController");
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => data),
    error: jest.fn((message) => ({ error: message })),
  },
}));

describe("InscriptionController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCampaignInscriptions", () => {
    it("debería obtener inscripciones de una campaña y retornar la función de desuscripción", async () => {
      const mockUnsubscribe = jest.fn();
      const setSortedKeys = jest.fn();
      const setTimeslots = jest.fn();

      Inscription.getCampaignInscriptions.mockResolvedValue(mockUnsubscribe);

      const result = await InscriptionController.getCampaignInscriptions(
        "campaign-1",
        setSortedKeys,
        setTimeslots
      );

      expect(Inscription.getCampaignInscriptions).toHaveBeenCalledWith(
        "campaign-1",
        setSortedKeys,
        setTimeslots
      );
      expect(result).toBe(mockUnsubscribe);
    });
  });

  describe("getAvailableTimeslots", () => {
    it("debería obtener horarios disponibles y retornar la función de cancelación", async () => {
      const mockUnsubscribe = jest.fn();
      const setAvailable = jest.fn();

      Inscription.getAvailableTimeslots.mockResolvedValue(mockUnsubscribe);

      const result = await InscriptionController.getAvailableTimeslots(
        "campaign-1",
        "10:00",
        setAvailable
      );

      expect(Inscription.getAvailableTimeslots).toHaveBeenCalledWith(
        "campaign-1",
        "10:00",
        setAvailable
      );
      expect(result).toBe(mockUnsubscribe);
    });
  });

  describe("reserveAppointment", () => {
    const mockFormData = {
      campaignId: "campaign-1",
      timeslot: "10:00",
      id: "user-1",
      name: "Daniel Granados Retana",
      email: "dandiego235@gmail.com",
      phone: "87241076",
      pet: "Frida",
      animal: true,
      sex: false,
      priceData: { price: 13000, weight: 20 },
      priceSpecial: false,
      campaign: "Campaña de Castración de Perros y Gatos",
      date: "2025-02-22",
      place: "Salón Comunal, Guararí, Heredia",
    };

    it("debería reservar una cita exitosamente", async () => {
      const mockAppointmentKey = "appointment-1";
      Inscription.reserveAppointment.mockResolvedValue(mockAppointmentKey);
      sendConfirmationEmail.mockResolvedValue({ ok: true });
      NotificationController.createNotification.mockResolvedValue();
      UserActivityController.registerActivity.mockResolvedValue();

      const result = await InscriptionController.reserveAppointment(
        mockFormData,
        true
      );

      expect(Inscription.reserveAppointment).toHaveBeenCalledWith(
        mockFormData,
        true
      );
      expect(sendConfirmationEmail).toHaveBeenCalledWith(
        mockFormData.email,
        mockFormData.name,
        mockFormData.timeslot,
        mockFormData.date,
        mockFormData.campaign + " en " + mockFormData.place,
        mockFormData.campaignId,
        mockAppointmentKey
      );
      expect(NotificationController.createNotification).toHaveBeenCalled();
      expect(UserActivityController.registerActivity).toHaveBeenCalled();
      expect(result).toEqual({
        message: "Appointment saved correctly!",
        emailResponse: { ok: true },
      });
    });

    it("debería manejar errores al reservar una cita", async () => {
      const error = new Error("Reservation failed");
      Inscription.reserveAppointment.mockRejectedValue(error);

      const result = await InscriptionController.reserveAppointment(
        mockFormData,
        true
      );

      expect(result).toEqual({ error });
    });
  });

  describe("getAppointments", () => {
    it("debería obtener las citas de un usuario", async () => {
      const setAppointments = jest.fn();

      await InscriptionController.getAppointments("user-1", setAppointments);

      expect(Inscription.getAppointments).toHaveBeenCalledWith(
        "user-1",
        setAppointments
      );
    });
  });

  describe("updateAppointment", () => {
    const mockFormData = {
      campaignId: "campaign-1",
      timeslot: "10:00",
      appointmentKey: "appt-1",
      id: "user-1",
      name: "Daniel Granados Retana",
      email: "dandiego235@gmail.com",
      phone: "87241076",
      pet: "Greta",
      animal: true,
      sex: false,
      priceData: { price: 13000, weight: 20 },
      priceSpecial: false,
    };

    it("debería actualizar una cita exitosamente", async () => {
      Inscription.updateAppointment.mockResolvedValue();

      const result = await InscriptionController.updateAppointment(
        mockFormData,
        true
      );

      expect(Inscription.updateAppointment).toHaveBeenCalledWith(
        mockFormData,
        true
      );
      expect(result).toEqual({ message: "Appointment updated correctly!" });
    });

    it("debería manejar errores al actualizar una cita", async () => {
      const error = new Error("Update failed");
      Inscription.updateAppointment.mockRejectedValue(error);

      const result = await InscriptionController.updateAppointment(
        mockFormData,
        true
      );

      expect(result).toEqual({ error });
    });
  });

  describe("deleteAppointment", () => {
    const mockFormData = {
      campaignId: "campaign-1",
      timeslot: "10:00",
      appointmentKey: "appt-1",
      id: "user-1",
      name: "Daniel Granados Retana",
      email: "dandiego235@gmail.com",
      phone: "87241076",
      pet: "Greta",
      animal: true,
      sex: false,
      priceData: { price: 13000, weight: 20 },
      priceSpecial: false,
      campaign: "Campaña de Castración de Perros y Gatos",
      date: "2025-02-22",
      place: "Salón Comunal, Guararí, Heredia",
    };

    it("debería eliminar una cita exitosamente", async () => {
      Inscription.deleteAppointment.mockResolvedValue();
      sendCancelEmail.mockResolvedValue({ ok: true });
      NotificationController.createNotification.mockResolvedValue();

      const result = await InscriptionController.deleteAppointment(
        mockFormData
      );

      expect(Inscription.deleteAppointment).toHaveBeenCalledWith(mockFormData);
      expect(sendCancelEmail).toHaveBeenCalledWith(
        mockFormData.email,
        mockFormData.name,
        mockFormData.timeslot,
        mockFormData.date,
        mockFormData.campaign
      );
      expect(NotificationController.createNotification).toHaveBeenCalled();
      expect(result).toEqual({
        message: "Appointment deleted correctly!",
        emailResponse: { ok: true },
      });
    });

    it("debería manejar errores al eliminar una cita", async () => {
      const error = new Error("Delete failed");
      Inscription.deleteAppointment.mockRejectedValue(error);

      const result = await InscriptionController.deleteAppointment(
        mockFormData
      );

      expect(result).toEqual({ error });
    });
  });

  describe("updateAttendance", () => {
    it("debería actualizar la asistencia exitosamente", async () => {
      Inscription.updateAttendance.mockResolvedValue();

      const result = await InscriptionController.updateAttendance(
        "campaign-1",
        "10:00",
        "inscription-1",
        true
      );

      expect(Inscription.updateAttendance).toHaveBeenCalledWith(
        "campaign-1",
        "10:00",
        "inscription-1",
        true
      );
      expect(result).toEqual({ message: "Attendance updated correctly!" });
    });

    it("debería manejar errores al actualizar la asistencia", async () => {
      const error = new Error("Update failed");
      Inscription.updateAttendance.mockRejectedValue(error);

      const result = await InscriptionController.updateAttendance(
        "campaign-1",
        "10:00",
        "inscription-1",
        true
      );

      expect(result).toEqual({ error });
    });
  });

  describe("getCampaignParticipants", () => {
    it("debería obtener los participantes de una campaña exitosamente", async () => {
      const mockParticipants = ["user-1", "user-2"];
      Inscription.getCampaignParticipants.mockResolvedValue(mockParticipants);

      const result = await InscriptionController.getCampaignParticipants(
        "campaign-1"
      );

      expect(Inscription.getCampaignParticipants).toHaveBeenCalledWith(
        "campaign-1"
      );
      expect(result).toEqual(mockParticipants);
    });

    it("debería manejar errores al obtener los participantes", async () => {
      const error = new Error("Failed to get participants");
      Inscription.getCampaignParticipants.mockRejectedValue(error);

      await expect(
        InscriptionController.getCampaignParticipants("campaign-1")
      ).rejects.toThrow(error);
    });
  });
});
