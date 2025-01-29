import { ref, get } from "firebase/database";
import CalendarCampaign from "@/models/CalendarCampaign";

// Configuración del mock de Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {}
}));

// Mock de las funciones de Firebase
jest.mock("firebase/database", () => {
  const mockRef = {
    toString: () => "mockRef"
  };
  return {
    ref: jest.fn((db, path) => ({
      ...mockRef,
      toString: () => path
    })),
    get: jest.fn()
  };
});

describe("CalendarCampaign Model", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    // Espiar console.error y console.log
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar console.error después de cada prueba
    consoleErrorSpy.mockRestore();
  });

  describe("getEventsByMonth", () => {
    it("debe obtener y combinar todos los tipos de eventos del mes", async () => {
      const mockData = {
        campaigns: {
          "camp1": {
            title: "Campaña 1",
            date: "2024-03-15T10:00:00.000Z",
            enabled: true
          },
          "camp2": {
            title: "Campaña 2",
            date: "2024-04-01T10:00:00.000Z",
            enabled: true
          }
        },
        activities: {
          "act1": {
            title: "Actividad 1",
            date: "2024-03-16T14:00:00.000Z",
            enabled: true
          }
        },
        raffles: {
          "raff1": {
            name: "Rifa 1",
            date: "2024-03-17T15:00:00.000Z",
            status: "active"
          }
        }
      };

      // Mock para diferentes referencias
      get.mockImplementation((ref) => {
        const path = ref.toString();
        let mockSnapshot = { exists: () => false };

        if (path === "campaigns" && mockData.campaigns) {
          mockSnapshot = {
            exists: () => true,
            forEach: (cb) => Object.entries(mockData.campaigns).forEach(([key, val]) => cb({
              key,
              val: () => val
            }))
          };
        } else if (path === "activities" && mockData.activities) {
          mockSnapshot = {
            exists: () => true,
            forEach: (cb) => Object.entries(mockData.activities).forEach(([key, val]) => cb({
              key,
              val: () => val
            }))
          };
        } else if (path === "raffles" && mockData.raffles) {
          mockSnapshot = {
            exists: () => true,
            forEach: (cb) => Object.entries(mockData.raffles).forEach(([key, val]) => cb({
              key,
              val: () => val
            }))
          };
        }

        return Promise.resolve(mockSnapshot);
      });

      const result = await CalendarCampaign.getEventsByMonth(2, 2024); // Marzo (0-based)

      // Verificar que se obtuvieron los eventos correctos
      expect(result).toHaveLength(3); // Solo los eventos de marzo
      
      // Verificar campaña
      const campaign = result.find(e => e.type === 'campaign');
      expect(campaign).toEqual({
        id: 'camp1',
        title: 'Campaña 1',
        date: expect.any(Date),
        type: 'campaign',
        color: '#4CAF50'
      });

      // Verificar actividad
      const activity = result.find(e => e.type === 'activity');
      expect(activity).toEqual({
        id: 'act1',
        title: 'Actividad 1',
        date: expect.any(Date),
        type: 'activity',
        color: '#2196F3'
      });

      // Verificar rifa
      const raffle = result.find(e => e.type === 'raffle');
      expect(raffle).toEqual({
        id: 'raff1',
        title: 'Rifa 1',
        date: expect.any(Date),
        type: 'raffle',
        color: '#E91E63'
      });
    });

    it("debe devolver array vacío cuando no hay eventos", async () => {
      get.mockImplementation(() => Promise.resolve({
        exists: () => false
      }));

      const result = await CalendarCampaign.getEventsByMonth(2, 2024);
      expect(result).toEqual([]);
    });

    it("debe manejar errores al obtener eventos", async () => {
      const error = new Error("Error al obtener eventos");
      get.mockRejectedValue(error);

      await expect(CalendarCampaign.getEventsByMonth(2, 2024))
        .rejects
        .toThrow("Error al obtener eventos");
    });

    it("debe filtrar correctamente los eventos por mes y año", async () => {
      const mockEvents = {
        campaigns: {
          "event1": {
            title: "Evento Marzo",
            date: "2024-03-15T10:00:00.000Z",
            enabled: true
          },
          "event2": {
            title: "Evento Abril",
            date: "2024-04-01T10:00:00.000Z",
            enabled: true
          },
          "event3": {
            title: "Evento Marzo Otro Año",
            date: "2023-03-15T10:00:00.000Z",
            enabled: true
          }
        }
      };

      get.mockImplementation((ref) => {
        const path = ref.toString();
        if (path === "campaigns") {
          return Promise.resolve({
            exists: () => true,
            forEach: (cb) => Object.entries(mockEvents.campaigns).forEach(([key, val]) => cb({
              key,
              val: () => val
            }))
          });
        }
        return Promise.resolve({
          exists: () => false
        });
      });

      const result = await CalendarCampaign.getEventsByMonth(2, 2024); // Marzo 2024

      const titles = result.map(e => e.title);
      expect(titles).toContain("Evento Marzo");
      expect(titles).not.toContain("Evento Abril");
      expect(titles).not.toContain("Evento Marzo Otro Año");
    });
  });
}); 