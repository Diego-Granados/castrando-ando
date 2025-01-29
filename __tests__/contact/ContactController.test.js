import ContactController from "@/controllers/ContactController";
import ContactRequest from "@/models/ContactRequest";
import { sendContactEmail, sendReply } from "@/controllers/EmailSenderController";
import NotificationController from "@/controllers/NotificationController";

// Mock dependencies
jest.mock("@/models/ContactRequest");
jest.mock("@/controllers/EmailSenderController");
jest.mock("@/controllers/NotificationController");

describe("ContactController", () => {
  let mockContactData;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockContactData = {
      idNumber: "118790545",
      name: "Diego Granados",
      email: "dandiegogranados@gmail.com",
      message: "Hola, quería consultar si castran canarios",
      type: "Consulta",
      date: "2025-01-13T00:25:46.283Z",
      read: false
    };
  });

  describe("createContactRequest", () => {
    it("debería crear una solicitud, enviar un email de aviso a la asociación y notificar a los administradores correctamente", async () => {
      const mockId = "OGS2LFl7hKrJTdV2Am0";
      ContactRequest.create.mockResolvedValue({ id: mockId });
      sendContactEmail.mockResolvedValue({ ok: true });
      NotificationController.createAdminNotification.mockResolvedValue();

      const result = await ContactController.createContactRequest(mockContactData);

      expect(result).toEqual({ id: mockId });
      expect(ContactRequest.create).toHaveBeenCalledWith(mockContactData);
      expect(sendContactEmail).toHaveBeenCalledWith(
        mockContactData.message,
        mockContactData.email,
        mockContactData.name,
        mockContactData.type
      );
      expect(NotificationController.createAdminNotification).toHaveBeenCalledWith({
        title: "Nuevo Mensaje de Contacto",
        message: `${mockContactData.name} ha enviado un mensaje de tipo: ${mockContactData.type}`,
        type: "contact_form",
        link: "/admin/contacto",
        contactId: mockId
      });
    });

    it("debería manejar errores en el envío del email pero crear la solicitud y la notificación", async () => {
      const mockId = "OGS2LFl7hKrJTdV2Am0";
      ContactRequest.create.mockResolvedValue({ id: mockId });
      sendContactEmail.mockResolvedValue({ ok: false });
      NotificationController.createAdminNotification.mockResolvedValue();

      const result = await ContactController.createContactRequest(mockContactData);

      expect(result).toEqual({ id: mockId });
      expect(ContactRequest.create).toHaveBeenCalledWith(mockContactData);
      expect(NotificationController.createAdminNotification).toHaveBeenCalled();
    });

    it("debería lanzar error si falla la creación de la solicitud", async () => {
      ContactRequest.create.mockRejectedValue(new Error("Error de creación"));

      await expect(ContactController.createContactRequest(mockContactData))
        .rejects
        .toThrow("Error de creación");
        
      expect(NotificationController.createAdminNotification).not.toHaveBeenCalled();
    });
  });

  describe("getAllContactRequests", () => {
    it("debería obtener todas las solicitudes correctamente", async () => {
      const mockRequests = [mockContactData];
      ContactRequest.getAll.mockResolvedValue(mockRequests);

      const result = await ContactController.getAllContactRequests();

      expect(result).toEqual(mockRequests);
      expect(ContactRequest.getAll).toHaveBeenCalled();
    });

    it("debería lanzar error si falla la obtención de solicitudes", async () => {
      ContactRequest.getAll.mockRejectedValue(new Error("Error de obtención"));

      await expect(ContactController.getAllContactRequests())
        .rejects
        .toThrow("Error de obtención");
    });
  });

  describe("updateContactRequest", () => {
    it("debería actualizar una solicitud correctamente", async () => {
      const requestId = "OGS2LFl7hKrJTdV2Am0";
      const updateData = { ...mockContactData, read: true };
      ContactRequest.update.mockResolvedValue(true);

      const result = await ContactController.updateContactRequest(requestId, updateData);

      expect(result).toBe(true);
      expect(ContactRequest.update).toHaveBeenCalledWith(requestId, updateData);
    });

    it("debería lanzar error si falla la actualización", async () => {
      const requestId = "OGS2LFl7hKrJTdV2Am0";
      ContactRequest.update.mockRejectedValue(new Error("Error de actualización"));

      await expect(ContactController.updateContactRequest(requestId, mockContactData))
        .rejects
        .toThrow("Error de actualización");
    });
  });

  describe("replyToContactRequest", () => {
    const mockReplyMessage = "Sí, castramos todo tipo de animales.";

    it("debería actualizar la solicitud y enviar el email de respuesta correctamente", async () => {
      ContactRequest.update.mockResolvedValue(true);
      sendReply.mockResolvedValue({ ok: true });

      const result = await ContactController.replyToContactRequest(
        "OGS2LFl7hKrJTdV2Am0",
        mockContactData,
        mockReplyMessage
      );

      expect(result).toBe(true);
      expect(ContactRequest.update).toHaveBeenCalledWith(
        "OGS2LFl7hKrJTdV2Am0",
        expect.objectContaining({
          reply: mockReplyMessage,
          read: true
        })
      );
      expect(sendReply).toHaveBeenCalledWith(
        mockContactData.message,
        mockContactData.email,
        mockContactData.name,
        mockReplyMessage
      );
    });

    it("debería lanzar error si falla la actualización de la solicitud", async () => {
      ContactRequest.update.mockResolvedValue(false);

      await expect(ContactController.replyToContactRequest(
        "OGS2LFl7hKrJTdV2Am0",
        mockContactData,
        mockReplyMessage
      )).rejects.toThrow("Failed to update contact request");
    });

    it("debería lanzar error si falla el envío del email de respuesta", async () => {
      ContactRequest.update.mockResolvedValue(true);
      sendReply.mockResolvedValue({ ok: false });

      await expect(ContactController.replyToContactRequest(
        "OGS2LFl7hKrJTdV2Am0",
        mockContactData,
        mockReplyMessage
      )).rejects.toThrow("Failed to send email");
    });
  });
}); 