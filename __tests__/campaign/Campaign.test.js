import Campaign from "@/models/Campaign";
import { db } from "@/lib/firebase/config";
import { ref, get, onValue, push, update } from "firebase/database";

// Mock Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  onValue: jest.fn(),
  push: jest.fn(),
  update: jest.fn(),
  increment: jest.fn(),
}));

describe("Campaign", () => {
  let mockCampaignData;

  beforeEach(() => {
    mockCampaignData = {
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
    };

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("constructor y validación", () => {
    it("debería crear un objeto campaña con información válida", () => {
      const campaign = new Campaign(mockCampaignData);
      expect(campaign.title).toBe(mockCampaignData.title);
      expect(campaign.date).toBe(mockCampaignData.date);
      expect(campaign.place).toBe(mockCampaignData.place);
    });

    it("debería levantar un error si no hay un título", () => {
      const invalidData = { ...mockCampaignData, title: "" };
      expect(() => new Campaign(invalidData)).toThrow(
        "Campaign must have a title"
      );
    });
  });

  describe("toJSON", () => {
    it("debería retornar la representación JSON correcta.", () => {
      const campaign = new Campaign(mockCampaignData);
      const json = campaign.toJSON();
      expect(json).toEqual(mockCampaignData);
    });
  });

  describe("filterEnabled", () => {
    it("debería filtrar las campañas deshabilitadas", () => {
      const campaigns = {
        1: { ...mockCampaignData, enabled: true },
        2: { ...mockCampaignData, enabled: false },
        3: { ...mockCampaignData, enabled: true },
      };

      Campaign.filterEnabled(campaigns);

      expect(campaigns).toHaveProperty("1");
      expect(campaigns).toHaveProperty("3");
      expect(campaigns).not.toHaveProperty("2");
    });
  });

  describe("getAll", () => {
    it("debería suscribirse a leer las campañas y filtrar las habilitadas", async () => {
      const setCampaigns = jest.fn();
      const mockSnapshot = {
        exists: () => true,
        val: () => ({
          1: { ...mockCampaignData, enabled: true },
          2: { ...mockCampaignData, enabled: false },
        }),
      };

      onValue.mockImplementation((ref, callback) => {
        callback(mockSnapshot);
        return jest.fn(); // Return unsubscribe function
      });

      await Campaign.getAll(setCampaigns);

      expect(ref).toHaveBeenCalledWith(db, "campaigns");
      expect(setCampaigns).toHaveBeenCalled();
      const calls = setCampaigns.mock.calls[0][0];
      expect(calls).toHaveProperty("1");
      expect(calls).not.toHaveProperty("2");
    });
  });

  describe("getById", () => {
    it("debería obtener una campaña por su ID y llamar al callback", async () => {
      const setCampaign = jest.fn();
      const mockSnapshot = {
        exists: () => true,
        val: () => mockCampaignData,
      };

      onValue.mockImplementation((ref, callback) => {
        callback(mockSnapshot);
        return jest.fn(); // Return unsubscribe function
      });

      const unsubscribe = await Campaign.getById("test-id", setCampaign);

      expect(ref).toHaveBeenCalledWith(db, "campaigns/test-id");
      expect(setCampaign).toHaveBeenCalledWith(mockCampaignData);
      expect(typeof unsubscribe).toBe("function");
    });

    it("no debería llamar al callback si la campaña no existe", async () => {
      const setCampaign = jest.fn();
      const mockSnapshot = {
        exists: () => false,
        val: () => null,
      };

      onValue.mockImplementation((ref, callback) => {
        callback(mockSnapshot);
        return jest.fn();
      });

      await Campaign.getById("non-existent-id", setCampaign);

      expect(ref).toHaveBeenCalledWith(db, "campaigns/non-existent-id");
      expect(setCampaign).not.toHaveBeenCalled();
    });

    it("debería retornar una función de cancelación de suscripción", async () => {
      const setCampaign = jest.fn();
      const mockUnsubscribe = jest.fn();

      onValue.mockImplementation((ref, callback) => {
        return mockUnsubscribe;
      });

      const unsubscribe = await Campaign.getById("test-id", setCampaign);

      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });

  describe("getByIdOnce", () => {
    it("debería obtener una campaña por su ID una sola vez", async () => {
      const setCampaign = jest.fn();
      const mockSnapshot = {
        exists: () => true,
        val: () => mockCampaignData,
      };

      get.mockResolvedValue(mockSnapshot);

      await Campaign.getByIdOnce("test-id", setCampaign);

      expect(ref).toHaveBeenCalledWith(db, "campaigns/test-id");
      expect(get).toHaveBeenCalled();
      expect(setCampaign).toHaveBeenCalledWith(mockCampaignData);
      expect(setCampaign).toHaveBeenCalledTimes(1);
    });

    it("no debería llamar al callback si la campaña no existe", async () => {
      const setCampaign = jest.fn();
      const mockSnapshot = {
        exists: () => false,
        val: () => null,
      };

      get.mockResolvedValue(mockSnapshot);

      await Campaign.getByIdOnce("non-existent-id", setCampaign);

      expect(ref).toHaveBeenCalledWith(db, "campaigns/non-existent-id");
      expect(get).toHaveBeenCalled();
      expect(setCampaign).not.toHaveBeenCalled();
    });
  });

  describe("getInscriptionsWeight", () => {
    it("debería calcular el peso total de las inscripciones habilitadas y no marcadas como presentes", async () => {
      const mockInscriptions = {
        "07:30": {
          appointments: {
            appt1: {
              enabled: true,
              present: false,
              priceData: { weight: "10" },
            },
            appt2: {
              enabled: true,
              present: true,
              priceData: { weight: "20" },
            },
            appt3: {
              enabled: false,
              present: false,
              priceData: { weight: "30" },
            },
          },
        },
        "08:00": {
          appointments: {
            appt1: {
              enabled: true,
              present: false,
              priceData: { weight: "10" },
            },
          },
        },
        "09:00": {
          appointments: {
            appt1: {
              enabled: true,
              present: false,
              priceData: { weight: "20" },
            },
            appt2: {
              enabled: true,
              present: false,
              priceData: { weight: "30" },
            },
          },
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockInscriptions,
      });

      const weight = await Campaign.getInscriptionsWeight("test-id");
      expect(weight).toBe(70); // Only appt1 should be counted
    });

    it("should return 0 if no inscriptions exist", async () => {
      get.mockResolvedValue({
        exists: () => false,
        val: () => null,
      });

      const weight = await Campaign.getInscriptionsWeight("test-id");
      expect(weight).toBe(0);
    });
  });

  describe("create", () => {
    it("debería crear una nueva campaña con inscripciones", async () => {
      const formData = {
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
      };
      const inscriptions = {
        "08:00": { available: 5 },
        "09:00": { available: 5 },
      };

      const mockPushRef = { key: "new-campaign-id" };
      push.mockReturnValue(mockPushRef);
      update.mockResolvedValue();

      await Campaign.create(formData, inscriptions);

      expect(push).toHaveBeenCalledWith(ref(db, "campaigns"));
      expect(update).toHaveBeenCalledWith(ref(db), {
        "/campaigns/new-campaign-id": formData,
        "/inscriptions/new-campaign-id": inscriptions,
      });
    });
  });

  describe("update", () => {
    it("debería actualizar una campaña y sus citas asociadas", async () => {
      const campaignId = "test-id";
      const formData = {
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
      };
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

      const subFormData = {
        title: formData.title,
        date: formData.date,
        place: formData.place,
      };

      const mockInscriptions = {
        "08:00": {
          appointments: {
            appt1: {
              id: "user1",
              enabled: true,
            },
          },
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockInscriptions,
      });

      await Campaign.update(campaignId, updates, subFormData);

      expect(get).toHaveBeenCalled();
      expect(update).toHaveBeenCalled();
      const updateCall = update.mock.calls[0][1];
      expect(updateCall).toHaveProperty(
        `/appointments/user1/appt1/campaign`,
        formData.title
      );
      expect(updateCall).toHaveProperty(
        `/appointments/user1/appt1/date`,
        formData.date
      );
      expect(updateCall).toHaveProperty(
        `/appointments/user1/appt1/place`,
        formData.place
      );
    });

    it("debería manejar el caso cuando no hay inscripciones", async () => {
      get.mockResolvedValue({
        exists: () => false,
      });

      await expect(Campaign.update("test-id", {}, {})).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining("No data available"),
        })
      );
    });
  });

  describe("delete", () => {
    it("debería marcar una campaña y sus citas como deshabilitadas", async () => {
      const campaignId = "test-id";
      const mockInscriptions = {
        "08:00": {
          appointments: {
            appt1: {
              id: "user1",
              enabled: true,
            },
          },
        },
      };

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockInscriptions,
      });

      await Campaign.delete(campaignId);

      expect(get).toHaveBeenCalled();
      expect(update).toHaveBeenCalled();
      const updateCall = update.mock.calls[0][1];
      expect(updateCall).toHaveProperty(
        `/campaigns/${campaignId}/enabled`,
        false
      );
      expect(updateCall).toHaveProperty(
        `/appointments/user1/appt1/enabled`,
        false
      );
    });

    it("debería manejar el caso cuando no hay inscripciones", async () => {
      get.mockResolvedValue({
        exists: () => false,
      });

      await expect(Campaign.delete("test-id")).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining("No data available"),
        })
      );
    });
  });
});
