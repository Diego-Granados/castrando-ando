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
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "YRCEDDFSCvWjZcXSuJSWsb1jez22" }
      });
      AuthController.getCedulaByUserId.mockResolvedValue("118770213");
      UserActivity.create.mockResolvedValue("-OHeeMkfJenHvZ-sP0OG");

      const result = await UserActivityController.registerActivity(mockActivityData);
      console.log(result);

      expect(result).toBe("-OHeeMkfJenHvZ-sP0OG");
      expect(UserActivity.create).toHaveBeenCalledWith(expect.objectContaining({
        type: mockActivityData.type,
        userId: "118770213"
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