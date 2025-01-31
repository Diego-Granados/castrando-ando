import UserActivityController from "@/controllers/UserActivityController";
import UserActivity from "@/models/UserActivity";
import AuthController from "@/controllers/AuthController";

// Mock dependencies
jest.mock("@/models/UserActivity");
jest.mock("@/controllers/AuthController");

describe("UserActivityController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerActivity", () => {
    const mockActivityData = {
      type: "LOST_PET_POST",
      description: "Se inscribió en la campaña de castración",
      metadata: {
        petType: "Perro",
        location: "Sanchez, Curridabat"
      }
    };

    it("debería registrar una actividad exitosamente", async () => {
      const userData = {
        uid: "YRCEDDFSCvWjZcXSuJSWsb1jez22",
        email: "dmm1462003@gmail.com",
        name: "Diego Mora Montes"
      };
      
      // Mock getCurrentUser
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: userData.uid }
      });

      // Mock getCedulaByUserId
      AuthController.getCedulaByUserId.mockResolvedValue("118770213");

      // Mock getUserData
      AuthController.getUserData.mockResolvedValue(userData);

      // Mock UserActivity.create
      UserActivity.create.mockResolvedValue("-OHeeMkfJenHvZ-sP0OG");

      const result = await UserActivityController.registerActivity(mockActivityData);

      expect(result).toBe("-OHeeMkfJenHvZ-sP0OG");
      expect(UserActivity.create).toHaveBeenCalledWith(expect.objectContaining({
        type: mockActivityData.type,
        userId: "118770213",
        userEmail: userData.email,
        userName: userData.name
      }));
    });

    it("debería lanzar error si no hay usuario autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue(null);

      await expect(UserActivityController.registerActivity(mockActivityData))
        .rejects
        .toThrow("No user authenticated");
    });
  });
}); 