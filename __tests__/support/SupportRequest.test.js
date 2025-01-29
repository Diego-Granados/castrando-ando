import { ref, get, set, push, remove, onValue } from "firebase/database";
import SupportRequest from "@/models/SupportRequest";

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
  set: jest.fn(),
  push: jest.fn(),
  remove: jest.fn(),
  onValue: jest.fn(),
  getDatabase: jest.fn()
}));

// Mock de fetch para eliminación de imágenes
global.fetch = jest.fn();

describe("SupportRequest Model", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockReset();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("createRequest", () => {
    it("debe crear una solicitud correctamente", async () => {
      const mockRequestData = {
        title: "Solicitud de prueba",
        description: "Descripción de prueba",
        imageUrl: "http://example.com/image.jpg",
        status: "Pendiente",
        userId: "user123",
        userName: "Usuario Test"
      };

      const mockNewRequestRef = { key: "request-id" };
      push.mockReturnValue(mockNewRequestRef);
      set.mockResolvedValue();

      const result = await SupportRequest.createRequest(mockRequestData);

      expect(push).toHaveBeenCalled();
      expect(set).toHaveBeenCalledWith(
        mockNewRequestRef,
        expect.objectContaining({
          title: mockRequestData.title,
          description: mockRequestData.description,
          imageUrl: mockRequestData.imageUrl,
          status: mockRequestData.status,
          userId: mockRequestData.userId,
          userName: mockRequestData.userName,
          date: expect.any(String),
          createdAt: expect.any(String)
        })
      );
      expect(result).toEqual({ id: "request-id" });
    });

    it("debe crear una solicitud con valores por defecto", async () => {
      const mockRequestData = {
        title: "Solicitud de prueba",
        description: "Descripción de prueba"
      };

      const mockNewRequestRef = { key: "request-id" };
      push.mockReturnValue(mockNewRequestRef);
      set.mockResolvedValue();

      await SupportRequest.createRequest(mockRequestData);

      expect(set).toHaveBeenCalledWith(
        mockNewRequestRef,
        expect.objectContaining({
          title: mockRequestData.title,
          description: mockRequestData.description,
          imageUrl: "",
          status: "Pendiente",
          userId: "admin",
          userName: "Administrador",
          date: expect.any(String),
          createdAt: expect.any(String)
        })
      );
    });
  });

  describe("getAll", () => {
    it("debe devolver todas las solicitudes ordenadas por fecha", async () => {
      const mockRequests = {
        "request1": {
          title: "Solicitud 1",
          createdAt: "2024-03-20T12:00:00.000Z"
        },
        "request2": {
          title: "Solicitud 2",
          createdAt: "2024-03-21T12:00:00.000Z"
        }
      };

      const mockSnapshot = {
        exists: () => true,
        forEach: (callback) => {
          Object.keys(mockRequests).forEach((key) => {
            callback({
              key,
              val: () => mockRequests[key]
            });
          });
        }
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await SupportRequest.getAll();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("request2"); // Más reciente primero
      expect(result[1].id).toBe("request1");
    });

    it("debe devolver array vacío cuando no hay solicitudes", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await SupportRequest.getAll();
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("debe devolver una solicitud por su ID", async () => {
      const mockRequest = {
        title: "Solicitud de prueba",
        description: "Descripción",
        createdAt: "2024-03-20T12:00:00.000Z"
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockRequest
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await SupportRequest.getById("request123");

      expect(result).toEqual({
        id: "request123",
        ...mockRequest,
        imageUrl: "",
        status: "Pendiente",
        date: expect.any(String)
      });
    });

    it("debe devolver null cuando la solicitud no existe", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await SupportRequest.getById("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("debe eliminar una solicitud correctamente", async () => {
      const mockRequestData = {
        imageUrl: "http://example.com/image.jpg"
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockRequestData
      };

      get.mockResolvedValue(mockSnapshot);
      remove.mockResolvedValue();
      global.fetch.mockResolvedValue({ ok: true });

      const result = await SupportRequest.delete("request123");

      expect(get).toHaveBeenCalled();
      expect(remove).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith('/api/storage/delete', expect.any(Object));
      expect(result).toBe(true);
    });

    it("debe lanzar error cuando no se proporciona el ID", async () => {
      await expect(SupportRequest.delete())
        .rejects
        .toThrow("ID de solicitud requerido");
    });

    it("debe lanzar error cuando la solicitud no existe", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(SupportRequest.delete("nonexistent"))
        .rejects
        .toThrow("La solicitud no existe");
    });
  });

  describe("updateStatus", () => {
    it("debe actualizar el estado de una solicitud correctamente", async () => {
      const mockRequestData = {
        title: "Solicitud",
        status: "Pendiente"
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockRequestData
      };

      get.mockResolvedValue(mockSnapshot);
      set.mockResolvedValue();

      await SupportRequest.updateStatus("request123", "Completada");

      const setCall = set.mock.calls[0];
      expect(setCall[1]).toEqual({
        ...mockRequestData,
        status: "Completada",
        updatedAt: expect.any(String)
      });
    });

    it("debe lanzar error cuando la solicitud no existe", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(SupportRequest.updateStatus("nonexistent", "Completada"))
        .rejects
        .toThrow("Solicitud no encontrada");
    });
  });

  describe("getUserData", () => {
    it("debe obtener los datos del usuario correctamente", async () => {
      const mockUidMapSnapshot = {
        exists: () => true,
        val: () => "123456789" // Cédula
      };

      const mockUserData = {
        name: "Usuario Test",
        email: "test@example.com"
      };

      const mockUserSnapshot = {
        exists: () => true,
        val: () => mockUserData
      };
      get.mockResolvedValueOnce(mockUidMapSnapshot);
      get.mockResolvedValueOnce(mockUserSnapshot);

      const result = await SupportRequest.getUserData("uid123");

      expect(result).toEqual(mockUserData);
    });

    it("debe lanzar error cuando no se encuentra el mapeo UID", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(SupportRequest.getUserData("nonexistent"))
        .rejects
        .toThrow("No se encontraron datos del usuario");
    });
  });
}); 