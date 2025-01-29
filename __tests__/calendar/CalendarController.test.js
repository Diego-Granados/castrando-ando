import CalendarController from "@/controllers/CalendarController";
import CalendarCampaign from "@/models/CalendarCampaign";

// Mock del modelo
jest.mock("@/models/CalendarCampaign");

describe("CalendarController", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("getCampaignsByMonth", () => {
    it("debe obtener todos los eventos exitosamente", async () => {
      const mockEvents = [
        {
          id: "campaign1",
          title: "Campaña 1",
          date: new Date("2024-03-15"),
          type: 'campaign',
          color: '#4CAF50'
        },
        {
          id: "activity1",
          title: "Actividad 1",
          date: new Date("2024-03-16"),
          type: 'activity',
          color: '#2196F3'
        },
        {
          id: "raffle1",
          title: "Rifa 1",
          date: new Date("2024-03-17"),
          type: 'raffle',
          color: '#E91E63'
        }
      ];

      CalendarCampaign.getEventsByMonth.mockResolvedValue(mockEvents);

      const result = await CalendarController.getCampaignsByMonth(2, 2024);

      expect(CalendarCampaign.getEventsByMonth).toHaveBeenCalledWith(2, 2024);
      expect(result).toEqual({
        ok: true,
        campaigns: [mockEvents[0]],
        activities: [mockEvents[1]],
        raffles: [mockEvents[2]],
        allEvents: mockEvents
      });
    });

    it("debe manejar errores al obtener eventos", async () => {
      const error = new Error("Error al obtener eventos");
      CalendarCampaign.getEventsByMonth.mockRejectedValue(error);

      const result = await CalendarController.getCampaignsByMonth(2, 2024);

      expect(result).toEqual({
        ok: false,
        error: error.message
      });
    });

    it("debe manejar el caso de no encontrar eventos", async () => {
      CalendarCampaign.getEventsByMonth.mockResolvedValue([]);

      const result = await CalendarController.getCampaignsByMonth(2, 2024);

      expect(result).toEqual({
        ok: true,
        campaigns: [],
        activities: [],
        raffles: [],
        allEvents: []
      });
    });
  });
}); 