import * as EmailSenderController from "@/controllers/EmailSenderController";
import EmailSender from "@/models/EmailSender";

// Mock EmailSender model
jest.mock("@/models/EmailSender");

describe("EmailSenderController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendContactEmail", () => {
    const mockData = {
      msg: "Test message",
      email: "test@example.com",
      name: "Test User",
      type: "consulta",
    };

    it("debería enviar email de contacto exitosamente", async () => {
      EmailSender.sendContactEmail.mockResolvedValue({ ok: true });

      const result = await EmailSenderController.sendContactEmail(
        mockData.msg,
        mockData.email,
        mockData.name,
        mockData.type
      );

      expect(EmailSender.sendContactEmail).toHaveBeenCalledWith(
        mockData.msg,
        mockData.email,
        mockData.name,
        mockData.type
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de contacto", async () => {
      EmailSender.sendContactEmail.mockResolvedValue({ ok: false });

      const result = await EmailSenderController.sendContactEmail(
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
      appointmentKey: "key-123",
    };

    it("debería enviar email de confirmación exitosamente", async () => {
      EmailSender.sendConfirmationEmail.mockResolvedValue({ ok: true });

      const result = await EmailSenderController.sendConfirmationEmail(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign,
        mockData.campaignId,
        mockData.appointmentKey
      );

      expect(EmailSender.sendConfirmationEmail).toHaveBeenCalledWith(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign,
        mockData.campaignId,
        mockData.appointmentKey
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de confirmación", async () => {
      EmailSender.sendConfirmationEmail.mockResolvedValue({ ok: false });

      const result = await EmailSenderController.sendConfirmationEmail(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign,
        mockData.campaignId,
        mockData.appointmentKey
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
      EmailSender.sendCancelEmail.mockResolvedValue({ ok: true });

      const result = await EmailSenderController.sendCancelEmail(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign
      );

      expect(EmailSender.sendCancelEmail).toHaveBeenCalledWith(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de cancelación", async () => {
      EmailSender.sendCancelEmail.mockResolvedValue({ ok: false });

      const result = await EmailSenderController.sendCancelEmail(
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
      EmailSender.sendReminder.mockResolvedValue({ ok: true });

      const result = await EmailSenderController.sendReminder(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign
      );

      expect(EmailSender.sendReminder).toHaveBeenCalledWith(
        mockData.email,
        mockData.name,
        mockData.hour,
        mockData.date,
        mockData.campaign
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de recordatorio", async () => {
      EmailSender.sendReminder.mockResolvedValue({ ok: false });

      const result = await EmailSenderController.sendReminder(
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
      EmailSender.sendReply.mockResolvedValue({ ok: true });

      const result = await EmailSenderController.sendReply(
        mockData.msg,
        mockData.mail,
        mockData.name,
        mockData.adminReply
      );

      expect(EmailSender.sendReply).toHaveBeenCalledWith(
        mockData.msg,
        mockData.mail,
        mockData.name,
        mockData.adminReply
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de respuesta", async () => {
      EmailSender.sendReply.mockResolvedValue({ ok: false });

      const result = await EmailSenderController.sendReply(
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
      EmailSender.sendNewsletterEmail.mockResolvedValue({ ok: true });

      const result = await EmailSenderController.sendNewsletterEmail(
        mockData.content,
        mockData.email,
        mockData.subject
      );

      expect(EmailSender.sendNewsletterEmail).toHaveBeenCalledWith(
        mockData.content,
        mockData.email,
        mockData.subject
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar newsletter", async () => {
      EmailSender.sendNewsletterEmail.mockResolvedValue({ ok: false });

      const result = await EmailSenderController.sendNewsletterEmail(
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
      EmailSender.sendActivityRegistrationEmail.mockResolvedValue({ ok: true });

      const result = await EmailSenderController.sendActivityRegistrationEmail(
        mockData.email,
        mockData.name,
        mockData.activity
      );

      expect(EmailSender.sendActivityRegistrationEmail).toHaveBeenCalledWith(
        mockData.email,
        mockData.name,
        mockData.activity
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de registro de actividad", async () => {
      EmailSender.sendActivityRegistrationEmail.mockResolvedValue({
        ok: false,
      });

      const result = await EmailSenderController.sendActivityRegistrationEmail(
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
      EmailSender.sendActivityDeregistrationEmail.mockResolvedValue({
        ok: true,
      });

      const result =
        await EmailSenderController.sendActivityDeregistrationEmail(
          mockData.email,
          mockData.name,
          mockData.activity
        );

      expect(EmailSender.sendActivityDeregistrationEmail).toHaveBeenCalledWith(
        mockData.email,
        mockData.name,
        mockData.activity
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email de cancelación de actividad", async () => {
      EmailSender.sendActivityDeregistrationEmail.mockResolvedValue({
        ok: false,
      });

      const result =
        await EmailSenderController.sendActivityDeregistrationEmail(
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
      EmailSender.sendCertificateEmail.mockResolvedValue({ ok: true });

      const result = await EmailSenderController.sendCertificateEmail(
        mockData.email,
        mockData.name,
        mockData.certificateBuffer
      );

      expect(EmailSender.sendCertificateEmail).toHaveBeenCalledWith(
        mockData.email,
        mockData.name,
        mockData.certificateBuffer
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar errores al enviar email con certificado", async () => {
      EmailSender.sendCertificateEmail.mockResolvedValue({ ok: false });

      const result = await EmailSenderController.sendCertificateEmail(
        mockData.email,
        mockData.name,
        mockData.certificateBuffer
      );

      expect(result).toEqual({ ok: false });
    });
  });
});
