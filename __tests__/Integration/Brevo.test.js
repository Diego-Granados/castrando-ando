describe("EmailSender Integration Tests", () => {
  beforeAll(() => {
    // Clear module mocks
    jest.unmock("@getbrevo/brevo");
    jest.unmock("console");
    // Reset modules to force reloading without mocks
    jest.resetModules();
  });

  describe("sendContactEmail", () => {
    it("debería enviar un email de contacto exitosamente", async () => {
      await jest.isolateModules(async () => {
        const EmailSender = (await import("@/models/EmailSender")).default;

        try {
          // Use test email from environment variables
          const testEmail = "dandiego235@gmail.com";
          const testName = "Daniel Granados Retana";
          const testMessage =
            "Esta es una prueba para las pruebas de integración. Por favor ignore.";
          const testType = "consulta";

          const result = await EmailSender.sendContactEmail(
            testMessage,
            testEmail,
            testName,
            testType
          );

          expect(result).toEqual({ ok: true });
        } catch (error) {
          console.error("Email send error:", error);
          throw error;
        }
      });
    }, 30000); // Increased timeout for email sending
  });
});
