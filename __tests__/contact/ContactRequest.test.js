import { db } from "@/lib/firebase/config";
import { ref, push, update, get } from "firebase/database";
import ContactRequest from "@/models/ContactRequest";

// Mock Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  push: jest.fn(),
  update: jest.fn(),
  get: jest.fn(),
}));

describe("ContactRequest", () => {
  let mockContactRequest;
  const mockDate = "2025-01-13T00:25:46.283Z";

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock Date.now
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

    // Setup mock contact request data
    mockContactRequest = {
      idNumber: "118790545",
      name: "Diego Grandos",
      email: "dandiegogranados@gmail.com",
      message: "Hola, quería consultar si castran canarios",
      type: "Consulta",
      date: mockDate,
      read: false
    };
  });

  describe("create", () => {
    it("debería retornar true cuando se crea correctamente", async () => {
      // Mock Firebase push and update responses
      const mockPushRef = { key: "mock-id" };
      push.mockReturnValue(mockPushRef);
      update.mockResolvedValue();

      const result = await ContactRequest.create(mockContactRequest);

      expect(result).toBe(true);
      expect(ref).toHaveBeenCalledWith(db, "contactRequests");
      expect(push).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith(
        ref(db),
        {
          [`/contactRequests/${mockPushRef.key}`]: mockContactRequest
        }
      );
    });

    it("debería retorna false cuando falla", async () => {
      // Mock Firebase error
      push.mockImplementation(() => {
        throw new Error("Firebase error");
      });

      const result = await ContactRequest.create(mockContactRequest);

      expect(result).toBe(false);
      expect(ref).toHaveBeenCalledWith(db, "contactRequests");
    });
  });

  describe("getAll", () => {
    it("should return all contact requests sorted by date", async () => {
      // Mock contact requests data
      const mockRequests = {
        "OGS2LFl7hKrJTdV2Am0": { ...mockContactRequest, date: "2024-03-23T10:00:00.000Z" },
        "OGS3_yVYAiqdNnNPqRl": { ...mockContactRequest, date: "2024-03-24T10:00:00.000Z" }
      };

      // Mock Firebase snapshot
      const mockSnapshot = {
        exists: () => true,
        val: () => mockRequests,
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

      const result = await ContactRequest.getAll();

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe("2024-03-24T10:00:00.000Z"); // Most recent first
      expect(ref).toHaveBeenCalledWith(db, "contactRequests");
    });

    it("debería retornar un arreglo vacío cuando no hay solicitudes", async () => {
      // Mock empty Firebase snapshot
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await ContactRequest.getAll();

      expect(result).toEqual([]);
      expect(ref).toHaveBeenCalledWith(db, "contactRequests");
    });
  });

  describe("update", () => {
    it("debería actualizar una solicitud de contacto correctamente", async () => {
      update.mockResolvedValue();

      const requestId = "mock-id";
      const updateData = {
        ...mockContactRequest,
        read: true
      };

      const result = await ContactRequest.update(requestId, updateData);

      expect(result).toBe(true);
      expect(update).toHaveBeenCalledWith(
        ref(db),
        {
          [`/contactRequests/${requestId}`]: updateData
        }
      );
    });

    it("debería retornar false cuando falla", async () => {
      update.mockImplementation(() => {
        throw new Error("Firebase error");
      });

      const requestId = "mock-id";
      const updateData = {
        ...mockContactRequest,
        read: true
      };

      const result = await ContactRequest.update(requestId, updateData);

      expect(result).toBe(false);
    });
  });

  describe("ContactRequest constructor", () => {
    it("debería crear una instancia de solicitud de contacto correctamente", () => {
      const request = new ContactRequest(mockContactRequest);
      
      expect(request.idNumber).toBe(mockContactRequest.idNumber);
      expect(request.name).toBe(mockContactRequest.name);
      expect(request.email).toBe(mockContactRequest.email);
      expect(request.message).toBe(mockContactRequest.message);
      expect(request.type).toBe(mockContactRequest.type);
      expect(request.date).toBe(mockContactRequest.date);
      expect(request.read).toBe(mockContactRequest.read);
    });

    it("debería dar error cuando no hay un mensaje", () => {
      const invalidData = { ...mockContactRequest, message: "" };
      
      expect(() => new ContactRequest(invalidData)).toThrow("Contact request must have a message");
    });

    it("debería dar error cuando no hay un email", () => {
      const invalidData = { ...mockContactRequest, email: "" };
      
      expect(() => new ContactRequest(invalidData)).toThrow("Contact request must have an email");
    });

    it("debería dar error cuando no hay un tipo", () => {
      const invalidData = { ...mockContactRequest, type: "" };
      
      expect(() => new ContactRequest(invalidData)).toThrow("Contact request must have a type");
    });
  });
}); 