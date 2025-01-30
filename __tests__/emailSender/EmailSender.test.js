import EmailSender from "@/models/EmailSender";
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

// Mock brevo API first
jest.mock("@getbrevo/brevo", () => {
  // Create mock functions inside the mock definition
  const mockSendTransacEmail = jest.fn();
  const mockSetApiKey = jest.fn();
  const mockApiInstance = {
    sendTransacEmail: mockSendTransacEmail,
    setApiKey: mockSetApiKey,
  };

  return {
    TransactionalEmailsApi: jest.fn(() => mockApiInstance),
    TransactionalEmailsApiApiKeys: {
      apiKey: "test-api-key",
    },
    SendSmtpEmail: jest.fn().mockImplementation(() => ({
      subject: "",
      to: [],
      htmlContent: "",
      sender: {},
      attachment: [],
    })),
  };
});

// Get the mock functions after the mock is created
const mockApiInstance = new TransactionalEmailsApi();
const mockSendTransacEmail = mockApiInstance.sendTransacEmail;

describe("EmailSender", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("formatEmailTemplate", () => {
    it("debería formatear el template correctamente", () => {
      const title = "Test Title";
      const subtitle = "Test Subtitle";
      const content = "Test Content";
      const additionalContent = "<div>Additional Content</div>";

      const result = EmailSender.formatEmailTemplate(
        title,
        subtitle,
        content,
        additionalContent
      );

      expect(result).toContain(title);
      expect(result).toContain(subtitle);
      expect(result).toContain(content);
      expect(result).toContain(additionalContent);
      expect(result).toContain("<!DOCTYPE html>");
    });

    it("debería manejar contenido adicional opcional", () => {
      const result = EmailSender.formatEmailTemplate(
        "Title",
        "Subtitle",
        "Content"
      );

      expect(result).not.toContain("undefined");
    });
  });

  describe("formatBodyContent", () => {
    it("debería formatear el contenido del cuerpo correctamente", () => {
      const content = "Test content";
      const result = EmailSender.formatBodyContent(content);

      expect(result).toContain(content);
      expect(result).toContain("font-family");
      expect(result).toContain("font-size");
    });
  });

  describe("sendContactEmail", () => {
    const mockData = {
      msg: "Test message",
      email: "test@example.com",
      name: "Test User",
      type: "consulta",
    };

    it("debería enviar email de contacto exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendContactEmail(
        mockData.msg,
        mockData.email,
        mockData.name,
        mockData.type
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining(mockData.name),
          to: expect.arrayContaining([
            expect.objectContaining({
              email: "asociacioncastrandoando@gmail.com",
            }),
          ]),
          sender: expect.objectContaining({
            name: mockData.name,
          }),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de contacto", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendContactEmail(
        mockData.msg,
        mockData.email,
        mockData.name,
        mockData.type
      );

      expect(result).toEqual({ ok: false });
    });
  });

  describe("sendConfirmationEmail", () => {
    const mockData = {
      email: "test@example.com",
      name: "Test User",
      hour: "10:00",
      date: "2024-03-20",
      campaign: "Test Campaign",
      campaignId: "camp-123",
      inscriptionId: "insc-123",
    };

    it("debería enviar email de confirmación exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendConfirmationEmail(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign,
        mockData.campaignId,
        mockData.inscriptionId
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining(mockData.name),
          to: expect.arrayContaining([
            expect.objectContaining({
              email: mockData.email,
              name: mockData.name,
            }),
          ]),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de confirmación", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendConfirmationEmail(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign,
        mockData.campaignId,
        mockData.inscriptionId
      );

      expect(result).toEqual({ ok: false });
    });
  });

  describe("sendCancelEmail", () => {
    const mockData = {
      email: "test@example.com",
      name: "Test User",
      hour: "10:00",
      date: "2024-03-20",
      campaign: "Test Campaign",
    };

    it("debería enviar email de cancelación exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendCancelEmail(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining("cancelada"),
          to: expect.arrayContaining([
            expect.objectContaining({
              email: mockData.email,
              name: mockData.name,
            }),
          ]),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de cancelación", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendCancelEmail(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign
      );

      expect(result).toEqual({ ok: false });
    });
  });

  describe("sendReminder", () => {
    const mockData = {
      email: "test@example.com",
      name: "Test User",
      hour: "10:00",
      date: "2024-03-20",
      campaign: "Test Campaign",
    };

    it("debería enviar email de recordatorio exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendReminder(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining("recordatorio"),
          to: expect.arrayContaining([
            expect.objectContaining({
              email: mockData.email,
              name: mockData.name,
            }),
          ]),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de recordatorio", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendReminder(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign
      );

      expect(result).toEqual({ ok: false });
    });
  });

  describe("sendReply", () => {
    const mockData = {
      msg: "Original message",
      mail: "test@example.com",
      name: "Test User",
      adminReply: "Admin response",
    };

    it("debería enviar email de respuesta exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendReply(
        mockData.msg,
        mockData.mail,
        mockData.name,
        mockData.adminReply
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: "Respuesta a tu mensaje - Castrando Ando",
          to: expect.arrayContaining([
            expect.objectContaining({
              email: mockData.mail,
              name: mockData.name,
            }),
          ]),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de respuesta", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendReply(
        mockData.msg,
        mockData.mail,
        mockData.name,
        mockData.adminReply
      );

      expect(result).toEqual({ ok: false });
    });
  });

  describe("sendNewsletterEmail", () => {
    const mockData = {
      content: "Newsletter content",
      email: "test@example.com",
      subject: "Newsletter Subject",
    };

    it("debería enviar newsletter exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendNewsletterEmail(
        mockData.content,
        mockData.email,
        mockData.subject
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: mockData.subject,
          to: expect.arrayContaining([
            expect.objectContaining({
              email: mockData.email,
            }),
          ]),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar newsletter", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendNewsletterEmail(
        mockData.content,
        mockData.email,
        mockData.subject
      );

      expect(result).toEqual({ ok: false });
    });
  });

  describe("sendActivityRegistrationEmail", () => {
    const mockActivity = {
      title: "Test Activity",
      date: "2024-03-20",
      hour: "10:00",
      location: "Test Location",
      requirements: "Test Requirements",
    };

    const mockData = {
      email: "test@example.com",
      name: "Test User",
      activity: mockActivity,
    };

    it("debería enviar email de registro de actividad exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendActivityRegistrationEmail(
        mockData.email,
        mockData.name,
        mockData.activity
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining(mockData.name),
          to: expect.arrayContaining([
            expect.objectContaining({
              email: mockData.email,
              name: mockData.name,
            }),
          ]),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de registro de actividad", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendActivityRegistrationEmail(
        mockData.email,
        mockData.name,
        mockData.activity
      );

      expect(result).toEqual({ ok: false });
    });
  });

  describe("sendActivityDeregistrationEmail", () => {
    const mockActivity = {
      title: "Test Activity",
      date: "2024-03-20",
      hour: "10:00",
    };

    const mockData = {
      email: "test@example.com",
      name: "Test User",
      activity: mockActivity,
    };

    it("debería enviar email de cancelación de actividad exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendActivityDeregistrationEmail(
        mockData.email,
        mockData.name,
        mockData.activity
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining("cancelada"),
          to: expect.arrayContaining([
            expect.objectContaining({
              email: mockData.email,
              name: mockData.name,
            }),
          ]),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de cancelación de actividad", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendActivityDeregistrationEmail(
        mockData.email,
        mockData.name,
        mockData.activity
      );

      expect(result).toEqual({ ok: false });
    });
  });

  describe("sendCertificateEmail", () => {
    const mockData = {
      email: "test@example.com",
      name: "Test User",
      certificateBuffer: Buffer.from("test certificate"),
    };

    it("debería enviar email con certificado exitosamente", async () => {
      mockSendTransacEmail.mockResolvedValueOnce({ ok: true });

      const result = await EmailSender.sendCertificateEmail(
        mockData.email,
        mockData.name,
        mockData.certificateBuffer
      );

      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: "Certificado de Voluntariado - Castrando Ando",
          to: expect.arrayContaining([
            expect.objectContaining({
              email: mockData.email,
              name: mockData.name,
            }),
          ]),
          attachment: expect.arrayContaining([
            expect.objectContaining({
              content: mockData.certificateBuffer.toString("base64"),
              type: "image/jpeg",
            }),
          ]),
        })
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email con certificado", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Send failed"));

      const result = await EmailSender.sendCertificateEmail(
        mockData.email,
        mockData.name,
        mockData.certificateBuffer
      );

      expect(result).toEqual({ ok: false });
    });
  });
});
