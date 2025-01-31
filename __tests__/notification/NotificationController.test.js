import NotificationController from "@/controllers/NotificationController";
import Notification from "@/models/Notification";
import AuthController from "@/controllers/AuthController";
import Activity from "@/models/Activity";
import InscriptionController from "@/controllers/InscriptionController";

// Mock dependencies
jest.mock("@/models/Notification");
jest.mock("@/controllers/AuthController");
jest.mock("@/models/Activity");
jest.mock("@/controllers/InscriptionController");

describe("NotificationController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe("sendBulkNotifications", () => {
    const mockNotificationData = {
      title: "Nueva actividad: Tarde en el parque",
      message: "Se ha creado una nueva actividad: Tarde en el parque",
      type: 'ACTIVITY_CREATED',
      link: '/actividades'
    };

    it("debería enviar notificaciones a múltiples usuarios", async () => {
      const userIds = ["118770213", "118790545", "119140052"];
      Notification.createBulkNotifications.mockResolvedValue([
        { status: "fulfilled", value: "notification-1" },
        { status: "fulfilled", value: "notification-2" },
        { status: "fulfilled", value: "notification-3" }
      ]);

      const result = await NotificationController.sendBulkNotifications(
        userIds,
        mockNotificationData
      );

      expect(result.successful).toBe(3);
      expect(result.failed).toBe(0);
    });
  });
}); 