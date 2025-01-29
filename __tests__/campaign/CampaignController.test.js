import CampaignController from "@/controllers/CampaignController";
import Campaign from "@/models/Campaign";
import AuthController from "@/controllers/AuthController";
import Medicine from "@/models/Medicine";
import { NextResponse } from "next/server";

// Mock the dependencies
jest.mock("@/models/Campaign");
jest.mock("@/controllers/AuthController");
jest.mock("@/models/Medicine");
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => data),
    error: jest.fn((message, options) => ({ message, ...options })),
  },
}));

jest.mock("@/controllers/NotificationController", () => ({
  sendNotificationToAllUsers: jest.fn().mockResolvedValue(),
  sendCampaignNotification: jest.fn().mockResolvedValue(),
}));

jest.mock("@/models/Notification", () => ({
  getAllUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/models/Inscription", () => ({
  getCampaignParticipants: jest.fn().mockResolvedValue([]),
}));

describe("CampaignController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    NextResponse.json.mockClear();
    NextResponse.error.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getAllCampaigns", () => {
    it("debería llamar a Campaign.getAll y retornar la función de cancelación", async () => {
      const setCampaigns = jest.fn();
      const mockUnsubscribe = jest.fn();
      Campaign.getAll.mockResolvedValue(mockUnsubscribe);

      const result = await CampaignController.getAllCampaigns(setCampaigns);

      expect(Campaign.getAll).toHaveBeenCalledWith(setCampaigns);
      expect(result).toBe(mockUnsubscribe);
    });
  });

  describe("getCampaignById", () => {
    it("debería llamar a Campaign.getById y retornar la función de cancelación", async () => {
      const setCampaign = jest.fn();
      const mockUnsubscribe = jest.fn();
      Campaign.getById.mockResolvedValue(mockUnsubscribe);

      const result = await CampaignController.getCampaignById(
        "test-id",
        setCampaign
      );

      expect(Campaign.getById).toHaveBeenCalledWith("test-id", setCampaign);
      expect(result).toBe(mockUnsubscribe);
    });
  });

  describe("getCampaignByIdOnce", () => {
    it("debería llamar a Campaign.getByIdOnce", async () => {
      const setCampaign = jest.fn();
      await CampaignController.getCampaignByIdOnce("test-id", setCampaign);

      expect(Campaign.getByIdOnce).toHaveBeenCalledWith("test-id", setCampaign);
    });
  });

  describe("verifyRole", () => {
    it("debería permitir acceso a usuarios admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {},
        role: "Admin",
      });

      const result = await CampaignController.verifyRole();
      expect(result).toBeUndefined();
    });

    it("debería rechazar acceso a usuarios no admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {},
        role: "User",
      });
      await expect(CampaignController.verifyRole()).rejects.toThrow(
        "User is not an admin"
      );
    });
  });

  describe("createCampaign", () => {
    const mockFormData = {
      id: "test-id",
      title: "Campaña de Castración para Perros y Gatos",
      date: "2025-01-28",
      place:
        "Antigua escuela Monseñor Delfín Quesada en Sabana Redonda de Poás",
      description:
        "Incluye medicación inyectada, medicación para la casa, desparasitación, corte de uñas, mini limpieza dental y limpieza de orejas.",
      phone: "87241075",
      pricesData: [
        { price: 13000, weight: 10 },
        { price: 16000, weight: 15 },
        { price: 22000, weight: 20 },
        { price: 26000, weight: 100 },
      ],
      priceSpecial: 5000,
      requirements: [
        "Perros y gatos en perfecto estado de salud.",
        "Solo animales con 12 horas de ayuno (comida y agua).",
        "Llevar cobija.",
        "Perros y gatos mayores de 3 meses.",
      ],
      photos: [
        "https://res.cloudinary.com/dmhnxr6fz/image/upload/f_auto,q_auto/v1738032927/campaigns/campaign-1738032926521/irdetguvuva0bhrwq2nq.jpg",
      ],
      startTime: "07:30",
      endTime: "3:00",
      slotsNumber: "10",
    };

    let originalGenerateInscriptions;

    beforeEach(() => {
      originalGenerateInscriptions = CampaignController.generateInscriptions;
      CampaignController.generateInscriptions = jest.fn().mockReturnValue({
        inscriptions: {},
        totalAvailableSlots: 85,
      });
      NextResponse.json.mockReturnValue({
        message: "Form data saved successfully!",
      });
    });

    afterEach(() => {
      CampaignController.generateInscriptions = originalGenerateInscriptions;
    });

    it("debería crear una campaña exitosamente", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {},
        role: "Admin",
      });
      Campaign.create.mockResolvedValue("test-id");

      const result = await CampaignController.createCampaign(mockFormData);

      expect(CampaignController.generateInscriptions).toHaveBeenCalledWith(
        mockFormData.startTime,
        mockFormData.endTime,
        parseInt(mockFormData.slotsNumber, 10)
      );

      expect(Campaign.create).toHaveBeenCalled();
      expect(result).toEqual({ message: "Form data saved successfully!" });
    });

    it("debería rechazar la creación si el usuario no es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {},
        role: "User",
      });

      const result = await CampaignController.createCampaign(mockFormData);

      expect(Campaign.create).not.toHaveBeenCalled();
      expect(NextResponse.error).toHaveBeenCalledWith(
        "User not authenticated",
        { status: 401 }
      );
    });
  });

  describe("generateInscriptions", () => {
    beforeEach(() => {
      expect(jest.isMockFunction(CampaignController.generateInscriptions)).toBe(
        false
      );
    });

    it("debería generar inscripciones correctamente", () => {
      const result = CampaignController.generateInscriptions(
        "08:00",
        "15:00",
        10
      );
      expect(result).toHaveProperty("inscriptions");
      expect(result).toHaveProperty("totalAvailableSlots");
      expect(result.inscriptions).toHaveProperty("08:00");
      expect(result.inscriptions["08:00"]).toEqual({ available: 10 });
      expect(result.totalAvailableSlots).toBe(80); // 8 horas * 10 slots
    });

    it("debería manejar horarios con media hora", () => {
      const result = CampaignController.generateInscriptions(
        "07:30",
        "15:00",
        10
      );

      expect(result.inscriptions).toHaveProperty("07:30");
      expect(result.inscriptions["07:30"]).toEqual({ available: 5 }); // mitad de slots
      expect(result.inscriptions).toHaveProperty("09:00");
      expect(result.inscriptions["10:00"]).toEqual({ available: 10 }); // slots completos
      expect(result.totalAvailableSlots).toBe(85); // 8.5 horas * 10 slots
    });
  });

  describe("updateCampaign", () => {
    const mockFormData = {
      campaignId: "test-id",
      id: "test-id",
      title: "Campaña de Castración para Perros y Gatos",
      date: "2025-01-28",
      place:
        "Antigua escuela Monseñor Delfín Quesada en Sabana Redonda de Poás",
      description:
        "Incluye medicación inyectada, medicación para la casa, desparasitación, corte de uñas, mini limpieza dental y limpieza de orejas.",
      phone: "87241075",
      pricesData: [
        { price: 13000, weight: 10 },
        { price: 16000, weight: 15 },
        { price: 22000, weight: 20 },
        { price: 26000, weight: 100 },
      ],
      priceSpecial: 5000,
      requirements: [
        "Perros y gatos en perfecto estado de salud.",
        "Solo animales con 12 horas de ayuno (comida y agua).",
        "Llevar cobija.",
        "Perros y gatos mayores de 3 meses.",
      ],
      photos: [
        "https://res.cloudinary.com/dmhnxr6fz/image/upload/f_auto,q_auto/v1738032927/campaigns/campaign-1738032926521/irdetguvuva0bhrwq2nq.jpg",
      ],
      available: 85,
      startTime: "07:30",
      endTime: "15:00",
    };

    beforeEach(() => {
      NextResponse.json.mockReturnValue({
        message: "Form data saved successfully!",
      });
    });

    it("debería actualizar una campaña exitosamente", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {},
        role: "Admin",
      });
      Campaign.update.mockResolvedValue();

      const result = await CampaignController.updateCampaign(mockFormData);

      expect(Campaign.update).toHaveBeenCalled();
      expect(result).toEqual({ message: "Form data saved successfully!" });
    });

    it("debería rechazar la actualización si el usuario no es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {},
        role: "User",
      });

      const result = await CampaignController.updateCampaign(mockFormData);

      expect(Campaign.update).not.toHaveBeenCalled();
      expect(NextResponse.error).toHaveBeenCalledWith(
        "User not authenticated",
        { status: 401 }
      );
    });
  });

  describe("deleteCampaign", () => {
    const mockFormData = {
      campaignId: "test-id",
      photos: ["photo1.jpg", "photo2.jpg"],
    };

    beforeEach(() => {
      global.fetch = jest.fn();
      NextResponse.json.mockReturnValue({
        message: "Campaign deleted successfully!",
      });
    });

    it("debería eliminar una campaña exitosamente", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {},
        role: "Admin",
      });
      Campaign.delete.mockResolvedValue();
      Campaign.getByIdOnce.mockImplementation((id, callback) => {
        callback({ title: "Test Campaign", date: "2024-01-01" });
      });
      global.fetch.mockResolvedValue({ ok: true });

      const result = await CampaignController.deleteCampaign(mockFormData);

      expect(Campaign.delete).toHaveBeenCalledWith(mockFormData.campaignId);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/storage/delete",
        expect.any(Object)
      );
      expect(result).toEqual({ message: "Campaign deleted successfully!" });
    });

    it("debería rechazar la eliminación si el usuario no es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {},
        role: "User",
      });

      const result = await CampaignController.deleteCampaign(mockFormData);

      expect(Campaign.delete).not.toHaveBeenCalled();
      expect(NextResponse.error).toHaveBeenCalledWith(
        "User not authenticated",
        { status: 401 }
      );
    });
  });

  describe("calculateMedicineNeeds", () => {
    it("debería calcular las necesidades de medicamentos correctamente", async () => {
      const mockWeight = 100;
      const mockMedicines = [
        {
          name: "Medicine 1",
          amount: 2,
          weightMultiplier: 10,
          daysOfTreatment: 3,
          unit: "pastillas",
        },
      ];

      Campaign.getInscriptionsWeight.mockResolvedValue(mockWeight);
      Medicine.getAllOnce.mockResolvedValue(mockMedicines);

      const result = await CampaignController.calculateMedicineNeeds("test-id");

      expect(result).toEqual([
        {
          name: "Medicine 1",
          total: 60, // (100/10) * 2 * 3 = 60
          unit: "pastillas",
        },
      ]);
    });

    it("debería calcular correctamente para pastillas con peso total 425kg", async () => {
      const mockWeight = 425;
      const mockMedicines = [
        {
          name: "Meloxicam",
          amount: 1,
          weightMultiplier: 10,
          daysOfTreatment: 4,
          unit: "pastillas",
        },
      ];

      Campaign.getInscriptionsWeight.mockResolvedValue(mockWeight);
      Medicine.getAllOnce.mockResolvedValue(mockMedicines);

      const result = await CampaignController.calculateMedicineNeeds("test-id");

      expect(result).toEqual([
        {
          name: "Meloxicam",
          total: 168, // floor(425/10) * 1 * 4 = 42 * 4 = 168
          unit: "pastillas",
        },
      ]);
    });

    it("debería calcular correctamente para mg con peso total 425kg", async () => {
      const mockWeight = 425;
      const mockMedicines = [
        {
          name: "Enroflaxina",
          amount: 100,
          weightMultiplier: 10,
          daysOfTreatment: 5,
          unit: "mg",
        },
      ];

      Campaign.getInscriptionsWeight.mockResolvedValue(mockWeight);
      Medicine.getAllOnce.mockResolvedValue(mockMedicines);

      const result = await CampaignController.calculateMedicineNeeds("test-id");

      expect(result).toEqual([
        {
          name: "Enroflaxina",
          total: 21000, // floor(425/10) * 100 * 5 = 42 * 100 * 5 = 21000
          unit: "mg",
        },
      ]);
    });

    it("debería manejar errores en el cálculo", async () => {
      Campaign.getInscriptionsWeight.mockRejectedValue(new Error("Test error"));

      await expect(
        CampaignController.calculateMedicineNeeds("test-id")
      ).rejects.toThrow("Test error");
    });

    it("debería manejar división por cero cuando weightMultiplier es 0", async () => {
      const mockWeight = 100;
      const mockMedicines = [
        {
          name: "Medicine 1",
          amount: 2,
          weightMultiplier: 0, // Divisor es 0
          daysOfTreatment: 3,
          unit: "ml",
        },
      ];

      Campaign.getInscriptionsWeight.mockResolvedValue(mockWeight);
      Medicine.getAllOnce.mockResolvedValue(mockMedicines);

      await expect(
        CampaignController.calculateMedicineNeeds("test-id")
      ).rejects.toThrow("Division by 0");
    });
  });
});
