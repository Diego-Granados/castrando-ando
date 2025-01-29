import { ref, get } from "firebase/database";
import CalendarCampaign from "@/models/CalendarCampaign";

// Configuración del mock de Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {},
  auth: {},
  storage: {}
}));

// Mock de las funciones de Firebase
jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  getDatabase: jest.fn()
}));

describe("CalendarCampaign Model", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    // Espiar console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar console.error después de cada prueba
    consoleErrorSpy.mockRestore();
  });

  describe("getCampaignsByMonth", () => {
    it("debe devolver las campañas del mes y año especificados", async () => {
      const mockCampaigns = {
        "campaign1": {
          title: "Campaña 1",
          date: "2024-03-15T10:00:00.000Z",
          location: "Ubicación 1"
        },
        "campaign2": {
          title: "Campaña 2",
          date: "2024-03-20T14:00:00.000Z",
          location: "Ubicación 2"
        },
        "campaign3": { // Campaña de otro mes
          title: "Campaña 3",
          date: "2024-04-01T10:00:00.000Z",
          location: "Ubicación 3"
        }
      };

      const mockSnapshot = {
        exists: () => true,
        forEach: (callback) => {
          Object.keys(mockCampaigns).forEach((key) => {
            callback({
              key,
              val: () => mockCampaigns[key]
            });
          });
        }
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await CalendarCampaign.getCampaignsByMonth(2, 2024); // Marzo (0-based)

      expect(result).toHaveLength(2); // Solo las campañas de marzo
      expect(result[0]).toEqual({
        id: "campaign1",
        ...mockCampaigns["campaign1"],
        date: expect.any(Date)
      });
      expect(result[1]).toEqual({
        id: "campaign2",
        ...mockCampaigns["campaign2"],
        date: expect.any(Date)
      });
    });

    it("debe devolver un array vacío cuando no hay campañas", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await CalendarCampaign.getCampaignsByMonth(2, 2024);
      expect(result).toEqual([]);
    });

    it("debe manejar errores al obtener las campañas", async () => {
      const error = new Error("Error al obtener campañas");
      get.mockRejectedValue(error);

      await expect(CalendarCampaign.getCampaignsByMonth(2, 2024))
        .rejects
        .toThrow("Error al obtener campañas");
    });
  });
}); 