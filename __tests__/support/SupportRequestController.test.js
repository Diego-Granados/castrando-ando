import SupportRequestController from "@/controllers/SupportRequestController";
import SupportRequest from "@/models/SupportRequest";
import AuthController from "@/controllers/AuthController";

// Mock de los modelos y fetch
jest.mock("@/models/SupportRequest");
jest.mock("@/controllers/AuthController");
global.fetch = jest.fn();
global.FormData = jest.fn(() => ({
  append: jest.fn()
}));

describe("SupportRequestController", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Reset fetch mock
    global.fetch.mockReset();
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = 'test-preset';
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("createRequest", () => {
    it("debe crear una solicitud como admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "admin123" },
        role: "Admin"
      });

      const mockRequestData = {
        title: "Test Request",
        description: "Test Description"
      };

      SupportRequest.createRequest.mockResolvedValue({ id: "request123" });

      const result = await SupportRequestController.createRequest(mockRequestData);

      expect(SupportRequest.createRequest).toHaveBeenCalledWith({
        title: mockRequestData.title,
        description: mockRequestData.description,
        imageUrl: "",
        userId: "admin",
        userName: "Administrador",
        status: "Pendiente",
        date: expect.any(String)
      });
      expect(result).toEqual({ ok: true, id: "request123" });
    });

    it("debe crear una solicitud como usuario normal", async () => {
      const mockUser = { uid: "user123" };
      const mockUserData = {
        name: "Test User"
      };

      AuthController.getCurrentUser.mockResolvedValue({
        user: mockUser,
        role: "User"
      });
      AuthController.getUserData.mockResolvedValue(mockUserData);

      const mockRequestData = {
        title: "Test Request",
        description: "Test Description"
      };

      SupportRequest.createRequest.mockResolvedValue({ id: "request123" });

      const result = await SupportRequestController.createRequest(mockRequestData);

      expect(SupportRequest.createRequest).toHaveBeenCalledWith({
        title: mockRequestData.title,
        description: mockRequestData.description,
        imageUrl: "",
        userId: mockUser.uid,
        userName: mockUserData.name,
        status: "Pendiente",
        date: expect.any(String)
      });
      expect(result).toEqual({ ok: true, id: "request123" });
    });

    it("debe manejar la subida de imagen correctamente", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "user123" },
        role: "User"
      });
      AuthController.getUserData.mockResolvedValue({ name: "Test User" });

      const mockImageUrl = "https://cloudinary.com/test-image.jpg";
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ secure_url: mockImageUrl })
      });

      const mockRequestData = {
        title: "Test Request",
        description: "Test Description",
        selectedImage: new File(["test"], "test.jpg", { type: "image/jpeg" })
      };

      SupportRequest.createRequest.mockResolvedValue({ id: "request123" });

      const result = await SupportRequestController.createRequest(mockRequestData);

      expect(fetch).toHaveBeenCalled();
      expect(SupportRequest.createRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: mockImageUrl
        })
      );
      expect(result.ok).toBe(true);
    });

    it("debe rechazar la creación si el usuario no está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ user: null });

      const result = await SupportRequestController.createRequest({
        title: "Test"
      });

      expect(SupportRequest.createRequest).not.toHaveBeenCalled();
      expect(result).toEqual({
        ok: false,
        error: "Usuario no autenticado"
      });
    });
  });

  describe("getRequests", () => {
    it("debe obtener todas las solicitudes", async () => {
      const mockRequests = [
        { id: "request1", title: "Request 1" },
        { id: "request2", title: "Request 2" }
      ];

      SupportRequest.getAll.mockResolvedValue(mockRequests);

      const result = await SupportRequestController.getRequests();

      expect(SupportRequest.getAll).toHaveBeenCalled();
      expect(result).toEqual({
        ok: true,
        requests: mockRequests
      });
    });

    it("debe manejar errores al obtener solicitudes", async () => {
      const error = new Error("Error de prueba");
      SupportRequest.getAll.mockRejectedValue(error);

      const result = await SupportRequestController.getRequests();

      expect(result).toEqual({
        ok: false,
        error: error.message
      });
    });
  });

  describe("updateRequestStatus", () => {
    it("debe actualizar el estado de una solicitud", async () => {
      SupportRequest.updateStatus.mockResolvedValue(true);

      const result = await SupportRequestController.updateRequestStatus(
        "request123",
        "Completada"
      );

      expect(SupportRequest.updateStatus).toHaveBeenCalledWith(
        "request123",
        "Completada"
      );
      expect(result).toEqual({ ok: true });
    });

    it("debe manejar errores al actualizar el estado", async () => {
      const error = new Error("Error de prueba");
      SupportRequest.updateStatus.mockRejectedValue(error);

      const result = await SupportRequestController.updateRequestStatus(
        "request123",
        "Completada"
      );

      expect(result).toEqual({
        ok: false,
        error: error.message
      });
    });
  });

  describe("deleteRequest", () => {
    it("debe eliminar una solicitud correctamente", async () => {
      SupportRequest.delete.mockResolvedValue(true);

      const result = await SupportRequestController.deleteRequest("request123");

      expect(SupportRequest.delete).toHaveBeenCalledWith("request123");
      expect(result).toEqual({ ok: true });
    });

    it("debe manejar el caso de ID no proporcionado", async () => {
      const result = await SupportRequestController.deleteRequest();

      expect(result).toEqual({
        ok: false,
        error: "ID de solicitud no proporcionado"
      });
    });

    it("debe manejar errores al eliminar", async () => {
      const error = new Error("Error de prueba");
      SupportRequest.delete.mockRejectedValue(error);

      const result = await SupportRequestController.deleteRequest("request123");

      expect(result).toEqual({
        ok: false,
        error: error.message
      });
    });

    it("debe manejar el caso de eliminación fallida", async () => {
      SupportRequest.delete.mockResolvedValue(false);

      const result = await SupportRequestController.deleteRequest("request123");

      expect(result).toEqual({
        ok: false,
        error: "No se pudo eliminar la solicitud"
      });
    });
  });
}); 