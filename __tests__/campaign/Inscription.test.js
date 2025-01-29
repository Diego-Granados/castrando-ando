import Inscription from "@/models/Inscription";
import {
  ref,
  get,
  child,
  update,
  onValue,
  push,
  increment,
} from "firebase/database";
import { db } from "@/lib/firebase/config";

// Mock Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  child: jest.fn(),
  update: jest.fn(),
  onValue: jest.fn(),
  push: jest.fn(),
  increment: jest.fn(),
}));

describe("Inscription", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCampaignInscriptions", () => {
    it("debería suscribirse a las inscripciones y ordenar los horarios", async () => {
      const mockData = {
        "10:00": { available: 6 },
        "09:00": { available: 6 },
        "11:00": { available: 6 },
        "07:30": { available: 3 },
        "11:30": { available: 3 },
      };
      const setSortedKeys = jest.fn();
      const setTimeslots = jest.fn();
      const mockUnsubscribe = jest.fn();

      ref.mockReturnValue("inscriptionsRef");
      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => mockData,
        });
        return mockUnsubscribe;
      });

      const result = await Inscription.getCampaignInscriptions(
        "campaign-1",
        setSortedKeys,
        setTimeslots
      );

      expect(ref).toHaveBeenCalledWith(db, "inscriptions/campaign-1");
      expect(setSortedKeys).toHaveBeenCalledWith([
        "07:30",
        "09:00",
        "10:00",
        "11:00",
        "11:30",
      ]);
      expect(setTimeslots).toHaveBeenCalledWith(mockData);
      expect(result).toBe(mockUnsubscribe);
    });

    it("debería manejar inscripciones no existentes", async () => {
      const setSortedKeys = jest.fn();
      const setTimeslots = jest.fn();
      const mockUnsubscribe = jest.fn();

      ref.mockReturnValue("inscriptionsRef");
      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => false,
          val: () => null,
        });
        return mockUnsubscribe;
      });

      const result = await Inscription.getCampaignInscriptions(
        "campaign-1",
        setSortedKeys,
        setTimeslots
      );

      expect(setSortedKeys).not.toHaveBeenCalled();
      expect(setTimeslots).not.toHaveBeenCalled();
      expect(result).toBe(mockUnsubscribe);
    });
  });

  describe("getAvailableTimeslots", () => {
    it("debería subscribirse a los horarios disponibles", async () => {
      const mockData = {
        appointments: {
          "-OHe8F5XNWRYl4UZD-T7": {
            animal: true,
            email: "dmm1462003@gmail.com",
            enabled: true,
            id: "118770213",
            name: "Diego Alonso Mora",
            pet: "Luna",
            phone: "70077997",
            present: false,
            priceData: {
              price: 13000,
              weight: 10,
            },
            priceSpecial: false,
            sex: false,
          },
        },
        available: 4,
      };
      const setAvailable = jest.fn();
      const mockUnsubscribe = jest.fn();

      ref.mockReturnValue("timeslotRef");
      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => mockData,
        });
        return mockUnsubscribe;
      });

      const result = await Inscription.getAvailableTimeslots(
        "campaign-1",
        "07:30",
        setAvailable
      );

      expect(ref).toHaveBeenCalledWith(db, "inscriptions/campaign-1/07:30");
      expect(setAvailable).toHaveBeenCalledWith(mockData);
      expect(result).toBe(mockUnsubscribe);
    });

    it("debería manejar horarios no existentes", async () => {
      const setAvailable = jest.fn();
      const mockUnsubscribe = jest.fn();

      ref.mockReturnValue("timeslotRef");
      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => false,
          val: () => null,
        });
        return mockUnsubscribe;
      });

      const result = await Inscription.getAvailableTimeslots(
        "campaign-1",
        "10:00",
        setAvailable
      );

      expect(setAvailable).not.toHaveBeenCalled();
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

    it("debería reservar una cita exitosamente con un usuario autenticado", async () => {
      const mockInscriptionKey = "inscription-1";
      ref.mockReturnValue("dbRef");
      push.mockReturnValue({ key: mockInscriptionKey });
      increment.mockReturnValue(9);

      await Inscription.reserveAppointment(mockFormData, true);

      expect(update).toHaveBeenCalledWith(
        "dbRef",
        expect.objectContaining({
          "campaigns/campaign-1/available": 9,
          [`inscriptions/campaign-1/10:00/available`]: 9,
          [`inscriptions/campaign-1/10:00/appointments/${mockInscriptionKey}`]:
            expect.objectContaining({
              id: "user-1",
              name: "Daniel Granados Retana",
              enabled: true,
              present: false,
            }),
          [`/appointments/user-1/${mockInscriptionKey}`]:
            expect.objectContaining({
              campaignId: "campaign-1",
              timeslot: "10:00",
              enabled: true,
            }),
        })
      );
    });

    it("debería reservar una cita exitosamente con un usuario no autenticado", async () => {
      const mockInscriptionKey = "inscription-1";
      ref.mockReturnValue("dbRef");
      push.mockReturnValue({ key: mockInscriptionKey });
      increment.mockReturnValue(9);

      await Inscription.reserveAppointment(mockFormData, false);

      expect(update).toHaveBeenCalledWith("dbRef", {
        "campaigns/campaign-1/available": 9,
        [`inscriptions/campaign-1/10:00/available`]: 9,
        [`inscriptions/campaign-1/10:00/appointments/${mockInscriptionKey}`]: {
          animal: true,
          email: "dandiego235@gmail.com",
          enabled: true,
          id: "user-1",
          name: "Daniel Granados Retana",
          pet: "Frida",
          phone: "87241076",
          present: false,
          priceData: { price: 13000, weight: 20 },
          priceSpecial: false,
          sex: false,
        },
        [`/appointments/user-1/${mockInscriptionKey}`]: {
          animal: true,
          email: "dandiego235@gmail.com",
          enabled: true,
          pet: "Frida",
          phone: "87241076",
          priceData: { price: 13000, weight: 20 },
          priceSpecial: false,
          sex: false,
          place: "Salón Comunal, Guararí, Heredia",
          date: "2025-02-22",
          campaign: "Campaña de Castración de Perros y Gatos",
          campaignId: "campaign-1",
          timeslot: "10:00",
          enabled: true,
        },
        [`/users/user-1/name`]: "Daniel Granados Retana",
      });
    });
  });

  describe("getAppointments", () => {
    it("debería obtener las citas de un usuario", async () => {
      const mockAppointments = {
        "-OHZnP2PLAbO_nfcnMzg": {
          animal: true,
          campaign: "Prueba",
          campaignId: "-OHZlHP_VHGu7CSqxyGq",
          date: "2025-01-27",
          email: "dmm1462003@gmail.com",
          enabled: false,
          pet: "Socrates",
          phone: "70077997",
          place: "prueba",
          priceData: {
            price: 13000,
            weight: 10,
          },
          priceSpecial: false,
          sex: true,
          timeslot: "07:30",
        },
        "-OHZqNMTnMKXukdVraZA": {
          animal: true,
          campaign: "Prueba",
          campaignId: "-OHZlHP_VHGu7CSqxyGq",
          date: "2025-01-27",
          email: "dmm1462003@gmail.com",
          enabled: true,
          pet: "Luna",
          phone: "70077997",
          place: "prueba",
          priceData: {
            price: 13000,
            weight: 10,
          },
          priceSpecial: false,
          sex: false,
          timeslot: "07:30",
        },
        "-OHdoQGt7U9Z4Do1gPD3": {
          animal: true,
          campaign: "Prueba",
          campaignId: "-OHdoC5nqF4-xhJzCcWO",
          date: "2025-01-28",
          email: "dmm1462003@gmail.com",
          enabled: false,
          pet: "Luna",
          phone: "70077997",
          place: "q",
          priceData: {
            price: 13000,
            weight: 10,
          },
          priceSpecial: false,
          sex: false,
          timeslot: "07:30",
        },
        "-OHe8F5XNWRYl4UZD-T7": {
          animal: true,
          campaign: "Prueba",
          campaignId: "-OHe7x2rUAMNXX5bduVj",
          date: "2025-01-28",
          email: "dmm1462003@gmail.com",
          enabled: true,
          pet: "Luna",
          phone: "70077997",
          place: "q",
          priceData: {
            price: 13000,
            weight: 10,
          },
          priceSpecial: false,
          sex: false,
          timeslot: "07:30",
        },
      };
      const setAppointments = jest.fn();

      ref.mockReturnValue("dbRef");
      child.mockReturnValue("childRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => mockAppointments,
      });

      await Inscription.getAppointments("user-1", setAppointments);

      const expectedAppointments = {
        "-OHZqNMTnMKXukdVraZA": {
          animal: true,
          campaign: "Prueba",
          campaignId: "-OHZlHP_VHGu7CSqxyGq",
          date: "2025-01-27",
          email: "dmm1462003@gmail.com",
          enabled: true,
          pet: "Luna",
          phone: "70077997",
          place: "prueba",
          priceData: {
            price: 13000,
            weight: 10,
          },
          priceSpecial: false,
          sex: false,
          timeslot: "07:30",
        },
        "-OHe8F5XNWRYl4UZD-T7": {
          animal: true,
          campaign: "Prueba",
          campaignId: "-OHe7x2rUAMNXX5bduVj",
          date: "2025-01-28",
          email: "dmm1462003@gmail.com",
          enabled: true,
          pet: "Luna",
          phone: "70077997",
          place: "q",
          priceData: {
            price: 13000,
            weight: 10,
          },
          priceSpecial: false,
          sex: false,
          timeslot: "07:30",
        },
      };
      expect(setAppointments).toHaveBeenCalledWith(expectedAppointments);
    });

    it("debería manejar citas no existentes", async () => {
      const setAppointments = jest.fn();

      ref.mockReturnValue("dbRef");
      child.mockReturnValue("childRef");
      get.mockResolvedValue({
        exists: () => false,
        val: () => null,
      });

      await Inscription.getAppointments("user-1", setAppointments);

      expect(setAppointments).toHaveBeenCalledWith({});
    });
  });

  describe("updateAppointment", () => {
    it("debería actualizar los detalles de la cita de un usuario autenticado", async () => {
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

      ref.mockReturnValue("dbRef");

      await Inscription.updateAppointment(mockFormData, true);

      expect(update).toHaveBeenCalledWith(
        "dbRef",
        expect.objectContaining({
          [`/inscriptions/campaign-1/10:00/appointments/appt-1/animal`]: true,
          [`/inscriptions/campaign-1/10:00/appointments/appt-1/name`]:
            "Daniel Granados Retana",
          [`/appointments/user-1/appt-1/animal`]: true,
          [`/appointments/user-1/appt-1/pet`]: "Greta",
        })
      );
    });

    it("debería actualizar los detalles de la cita de un usuario no autenticado", async () => {
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

      ref.mockReturnValue("dbRef");

      await Inscription.updateAppointment(mockFormData, false);

      expect(update).toHaveBeenCalledWith(
        "dbRef",
        expect.objectContaining({
          [`/inscriptions/campaign-1/10:00/appointments/appt-1/animal`]: true,
          [`/inscriptions/campaign-1/10:00/appointments/appt-1/name`]:
            "Daniel Granados Retana",
          [`/appointments/user-1/appt-1/animal`]: true,
          [`/appointments/user-1/appt-1/pet`]: "Greta",
        })
      );
    });

    it("debería manejar el error de que no se proporcionó el identificador de la cita", async () => {
      const mockFormData = {};
      await expect(
        Inscription.updateAppointment(mockFormData, true)
      ).rejects.toThrow("Appointment key is required");
    });

    it("debería manejar el error de que no se proporcionó el identificador de la campaña", async () => {
      const mockFormData = { appointmentKey: "app1" };
      await expect(
        Inscription.updateAppointment(mockFormData, true)
      ).rejects.toThrow("Campaign ID is required");
    });

    it("debería manejar el error de que no se proporcionó el horario de la cita", async () => {
      const mockFormData = { appointmentKey: "app1", campaignId: "camp1" };
      await expect(
        Inscription.updateAppointment(mockFormData, true)
      ).rejects.toThrow("Timeslot is required");
    });
  });

  describe("deleteAppointment", () => {
    it("debería eliminar una cita", async () => {
      const mockFormData = {
        campaignId: "campaign-1",
        timeslot: "10:00",
        appointmentKey: "appt-1",
        id: "user-1",
      };

      ref.mockReturnValue("dbRef");
      increment.mockReturnValue("incrementValue");

      await Inscription.deleteAppointment(mockFormData);

      expect(update).toHaveBeenCalledWith("dbRef", {
        "/campaigns/campaign-1/available": "incrementValue",
        "/inscriptions/campaign-1/10:00/available": "incrementValue",
        "/inscriptions/campaign-1/10:00/appointments/appt-1/enabled": false,
        "/appointments/user-1/appt-1/enabled": false,
      });
    });
  });

  describe("updateAttendance", () => {
    it("debería actualizar el estado de asistencia", async () => {
      ref.mockReturnValue("dbRef");

      await Inscription.updateAttendance("campaign-1", "10:00", "appt-1", true);

      expect(update).toHaveBeenCalledWith("dbRef", {
        "inscriptions/campaign-1/10:00/appointments/appt-1/present": true,
      });
    });
  });

  describe("getCampaignParticipants", () => {
    it("debería obtener participantes únicos de una campaña", async () => {
      const mockInscriptions = {
        "10:00": {
          appointments: {
            "appt-1": { id: "user-1", enabled: true },
            "appt-2": { id: "user-2", enabled: true },
          },
        },
        "11:00": {
          appointments: {
            "appt-3": { id: "user-1", enabled: true },
            "appt-4": { id: "user-3", enabled: true },
            "appt-5": { id: "user-4", enabled: false },
          },
        },
      };

      ref.mockReturnValue("inscriptionsRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => mockInscriptions,
      });

      const result = await Inscription.getCampaignParticipants("campaign-1");

      expect(result).toEqual(
        expect.arrayContaining(["user-1", "user-2", "user-3"])
      );
      expect(result.length).toBe(3); // Should have no duplicates
    });

    it("debería manejar una campaña sin participantes", async () => {
      ref.mockReturnValue("inscriptionsRef");
      get.mockResolvedValue({
        exists: () => false,
        val: () => null,
      });

      const result = await Inscription.getCampaignParticipants("campaign-1");

      expect(result).toEqual([]);
    });

    it("debería manejar errores", async () => {
      ref.mockReturnValue("inscriptionsRef");
      get.mockRejectedValue(new Error("Database error"));

      await expect(
        Inscription.getCampaignParticipants("campaign-1")
      ).rejects.toThrow("Database error");
    });
  });
});
