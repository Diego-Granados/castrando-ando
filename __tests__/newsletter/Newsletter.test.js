import { db } from "@/lib/firebase/config";
import { ref, push, update, get, remove } from "firebase/database";
import Newsletter from "@/models/Newsletter";

jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  push: jest.fn(),
  update: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
}));

describe("Newsletter", () => {
  let mockMessage;
  let mockSubscriber;
  const mockDate = "2025-01-13T00:25:46.283Z";

  beforeEach(() => {
    // Clear all mocks and their implementations
    jest.clearAllMocks();
    jest.resetAllMocks();
    
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

    // Reset mock implementations
    update.mockReset();
    remove.mockReset();
    push.mockReset();
    get.mockReset();
    ref.mockReset();

    mockMessage = {
      subject: "Campaña de castración en Heredia",
      content: "Tendremos una campaña el próximo mes en Heredia Centro",
      status: "draft",
      createdAt: mockDate,
      sentAt: null
    };

    mockSubscriber = {
      email: "dandiegogranados@gmail.com",
      subscribedAt: mockDate
    };
  });

  describe("create", () => {
    it("debería crear un mensaje de boletín correctamente", async () => {
      const mockPushRef = { key: "OGS2LFl7hKrJTdV2Am0" };
      push.mockReturnValue(mockPushRef);
      update.mockResolvedValue();

      const result = await Newsletter.create({
        subject: mockMessage.subject,
        content: mockMessage.content
      });

      expect(result).toEqual(true);
      expect(ref).toHaveBeenCalledWith(db, "newsletterMessages");
      expect(update).toHaveBeenCalledWith(
        ref(db, `newsletterMessages/${mockPushRef.key}`),
        expect.objectContaining({
          subject: mockMessage.subject,
          content: mockMessage.content,
          status: "draft",
          createdAt: mockDate
        })
      );
    });

    it("debería lanzar error si falla la creación", async () => {
      push.mockImplementation(() => {
        throw new Error("Error al crear el mensaje");
      });

      await expect(Newsletter.create(mockMessage))
        .rejects
        .toThrow("Error al crear el mensaje");
    });
  });

  describe("getAll", () => {
    it("debería obtener todos los mensajes ordenados por fecha", async () => {
      const mockMessages = {
        "OGS2LFl7hKrJTdV2Am0": { ...mockMessage, createdAt: "2024-03-23T10:00:00.000Z" },
        "OGS3_yVYAiqdNnNPqRl": { ...mockMessage, createdAt: "2024-03-24T10:00:00.000Z" }
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockMessages,
        forEach: (callback) => {
          Object.keys(mockMessages).forEach((key) => {
            callback({
              key,
              val: () => mockMessages[key]
            });
          });
        }
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await Newsletter.getAll();

      expect(result).toHaveLength(2);
      expect(result[0].createdAt).toBe("2024-03-24T10:00:00.000Z"); // Most recent first
      expect(ref).toHaveBeenCalledWith(db, "newsletterMessages");
    });

    it("debería retornar un arreglo vacío cuando no hay mensajes", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await Newsletter.getAll();

      expect(result).toEqual([]);
    });
  });

  describe("addSubscriber", () => {
    it("debería agregar un suscriptor correctamente", async () => {
      const mockSnapshot = {
        exists: () => false
      };
      get.mockResolvedValue(mockSnapshot);

      const mockPushRef = { key: "OGS2LFl7hKrJTdV2Am0" };
      push.mockReturnValue(mockPushRef);

      const result = await Newsletter.addSubscriber(mockSubscriber);

      expect(result).toEqual({
        ...mockSubscriber,
        id: mockPushRef.key
      });
      expect(ref).toHaveBeenCalledWith(db, "newsletterSubscribers");
    });

    it("debería lanzar error si el email ya está suscrito", async () => {
      const mockSnapshot = {
        exists: () => true,
        val: () => ({
          "existingId": {
            email: mockSubscriber.email.toUpperCase(), // Test case insensitive
            subscribedAt: "2024-03-23T10:00:00.000Z"
          }
        })
      };
      get.mockResolvedValue(mockSnapshot);

      await expect(Newsletter.addSubscriber(mockSubscriber))
        .rejects
        .toThrow("Email already subscribed");
    });
  });

  describe("getAllSubscribers", () => {
    it("debería obtener todos los suscriptores ordenados por fecha", async () => {
      const mockSubscribers = {
        "OGS2LFl7hKrJTdV2Am0": { ...mockSubscriber, subscribedAt: "2024-03-23T10:00:00.000Z" },
        "OGS3_yVYAiqdNnNPqRl": { ...mockSubscriber, subscribedAt: "2024-03-24T10:00:00.000Z" }
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockSubscribers,
        forEach: (callback) => {
          Object.keys(mockSubscribers).forEach((key) => {
            callback({
              key,
              val: () => mockSubscribers[key]
            });
          });
        }
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await Newsletter.getAllSubscribers();

      expect(result).toHaveLength(2);
      expect(result[0].subscribedAt).toBe("2024-03-24T10:00:00.000Z"); // Most recent first
      expect(ref).toHaveBeenCalledWith(db, "newsletterSubscribers");
    });

    it("debería retornar un arreglo vacío cuando no hay suscriptores", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await Newsletter.getAllSubscribers();

      expect(result).toEqual([]);
    });
  });

  describe("update", () => {
    it("debería actualizar un mensaje correctamente", async () => {
      update.mockResolvedValue();

      const messageId = "OGS2LFl7hKrJTdV2Am0";
      const updateData = {
        ...mockMessage,
        subject: "Nuevo asunto"
      };

      const result = await Newsletter.update(messageId, updateData);

      expect(result).toBe(true);
      expect(update).toHaveBeenCalledWith(
        ref(db, `newsletterMessages/${messageId}`),
        updateData
      );
    });

    it("debería lanzar error si falla la actualización", async () => {
      update.mockRejectedValue(new Error("Error de actualización"));

      await expect(Newsletter.update("OGS2LFl7hKrJTdV2Am0", mockMessage))
        .rejects
        .toThrow("Error de actualización");
    });
  });

  describe("delete", () => {
    it("debería eliminar un mensaje correctamente", async () => {
      const messageId = "OGS2LFl7hKrJTdV2Am0";
      update.mockResolvedValue();

      const result = await Newsletter.delete(messageId);

      expect(result).toBe(true);
      expect(update).toHaveBeenCalledWith(
        ref(db),
        {
          [`/newsletterMessages/${messageId}`]: null
        }
      );
    });

    it("debería lanzar error si falla la eliminación", async () => {
      const messageId = "OGS2LFl7hKrJTdV2Am0";
      update.mockRejectedValue(new Error("Error al eliminar mensaje"));

      await expect(Newsletter.delete(messageId))
        .rejects
        .toThrow("Error al eliminar mensaje");
    });

    it("debería eliminar un suscriptor correctamente", async () => {
      const subscriberId = "OGS2LFl7hKrJTdV2Am0";
      update.mockResolvedValue();

      const result = await Newsletter.deleteSubscriber(subscriberId);

      expect(result).toBe(true);
      expect(update).toHaveBeenCalledWith(
        ref(db),
        {
          [`/newsletterSubscribers/${subscriberId}`]: null
        }
      );
    });

    it("debería lanzar error si falla la eliminación del suscriptor", async () => {
      const subscriberId = "OGS2LFl7hKrJTdV2Am0";
      update.mockRejectedValue(new Error("Error al eliminar suscriptor"));

      await expect(Newsletter.deleteSubscriber(subscriberId))
        .rejects
        .toThrow("Error al eliminar suscriptor");
    });
  });
}); 