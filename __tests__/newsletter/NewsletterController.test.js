import NewsletterController from "@/controllers/NewsletterController";
import Newsletter from "@/models/Newsletter";
import { sendNewsletterEmail } from "@/controllers/EmailSenderController";

// Mock dependencies
jest.mock("@/models/Newsletter");
jest.mock("@/controllers/EmailSenderController");

describe("NewsletterController", () => {
  let mockMessage;
  let mockSubscriber;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockMessage = {
      id: "OGS2LFl7hKrJTdV2Am0",
      subject: "Campaña de castración en Heredia",
      content: "Tendremos una campaña el próximo mes en Heredia Centro",
      status: "draft",
      createdAt: "2025-01-13T00:25:46.283Z",
      sentAt: null
    };

    mockSubscriber = {
      id: "OGS3_yVYAiqdNnNPqRl",
      email: "dandiegogranados@gmail.com",
      subscribedAt: "2025-01-13T00:25:46.283Z"
    };
  });

  describe("createMessage", () => {
    it("debería crear un mensaje de boletín correctamente", async () => {
      Newsletter.create.mockResolvedValue(true);

      const result = await NewsletterController.createMessage({
        subject: mockMessage.subject,
        content: mockMessage.content
      });

      expect(result).toBe(true);
      expect(Newsletter.create).toHaveBeenCalledWith({
        subject: mockMessage.subject,
        content: mockMessage.content
      });
    });

    it("debería lanzar error si falla la creación", async () => {
      Newsletter.create.mockRejectedValue(new Error("Error al crear mensaje"));

      await expect(NewsletterController.createMessage(mockMessage))
        .rejects
        .toThrow("Error al crear mensaje");
    });
  });

  describe("sendMessage", () => {
    it("debería enviar el mensaje a todos los suscriptores correctamente", async () => {
      const subscribers = [
        mockSubscriber,
        { ...mockSubscriber, id: "OGS4_yVYAiqdNnNPqRm", email: "otro@email.com" }
      ];
      
      Newsletter.getAllSubscribers.mockResolvedValue(subscribers);
      sendNewsletterEmail.mockResolvedValue({ ok: true });
      Newsletter.update.mockResolvedValue(true);

      const result = await NewsletterController.sendMessage(mockMessage);

      expect(result).toEqual({
        success: true,
        totalSent: 2,
        failedCount: 0,
        failedEmails: []
      });
      expect(Newsletter.update).toHaveBeenCalledWith(
        mockMessage.id,
        expect.objectContaining({
          status: "sent",
          sentAt: expect.any(String)
        })
      );
    });

    it("debería manejar errores en el envío a algunos suscriptores", async () => {
      const subscribers = [
        mockSubscriber,
        { ...mockSubscriber, id: "OGS4_yVYAiqdNnNPqRm", email: "error@email.com" }
      ];
      
      Newsletter.getAllSubscribers.mockResolvedValue(subscribers);
      sendNewsletterEmail
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: false });
      Newsletter.update.mockResolvedValue(true);

      const result = await NewsletterController.sendMessage(mockMessage);

      expect(result).toEqual({
        success: true,
        totalSent: 1,
        failedCount: 1,
        failedEmails: ["error@email.com"]
      });
    });

    it("debería lanzar error si no hay suscriptores", async () => {
      Newsletter.getAllSubscribers.mockResolvedValue([]);

      await expect(NewsletterController.sendMessage(mockMessage))
        .rejects
        .toThrow("No hay suscriptores para enviar el boletín");
    });
  });

  describe("addSubscriber", () => {
    it("debería agregar un suscriptor correctamente", async () => {
      Newsletter.addSubscriber.mockResolvedValue(mockSubscriber);

      const result = await NewsletterController.addSubscriber({
        email: mockSubscriber.email
      });

      expect(result).toEqual(mockSubscriber);
      expect(Newsletter.addSubscriber).toHaveBeenCalledWith({
        email: mockSubscriber.email
      });
    });

    it("debería lanzar error si el email ya está suscrito", async () => {
      Newsletter.addSubscriber.mockRejectedValue(new Error("Email already subscribed"));

      await expect(NewsletterController.addSubscriber({
        email: mockSubscriber.email
      }))
        .rejects
        .toThrow("Email already subscribed");
    });
  });

  describe("getAllSubscribers", () => {
    it("debería obtener todos los suscriptores correctamente", async () => {
      const mockSubscribers = [mockSubscriber];
      Newsletter.getAllSubscribers.mockResolvedValue(mockSubscribers);

      const result = await NewsletterController.getAllSubscribers();

      expect(result).toEqual(mockSubscribers);
      expect(Newsletter.getAllSubscribers).toHaveBeenCalled();
    });

    it("debería lanzar error si falla la obtención", async () => {
      Newsletter.getAllSubscribers.mockRejectedValue(new Error("Error de obtención"));

      await expect(NewsletterController.getAllSubscribers())
        .rejects
        .toThrow("Error de obtención");
    });
  });

  describe("updateSubscriber", () => {
    it("debería actualizar un suscriptor correctamente", async () => {
      Newsletter.updateSubscriber.mockResolvedValue(true);

      const result = await NewsletterController.updateSubscriber(
        mockSubscriber.id,
        mockSubscriber
      );

      expect(result).toBe(true);
      expect(Newsletter.updateSubscriber).toHaveBeenCalledWith(
        mockSubscriber.id,
        mockSubscriber
      );
    });
  });

  describe("deleteSubscriber", () => {
    it("debería eliminar un suscriptor correctamente", async () => {
      Newsletter.deleteSubscriber.mockResolvedValue(true);

      const result = await NewsletterController.deleteSubscriber(mockSubscriber.id);

      expect(result).toBe(true);
      expect(Newsletter.deleteSubscriber).toHaveBeenCalledWith(mockSubscriber.id);
    });
  });
}); 