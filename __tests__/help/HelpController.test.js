import HelpController from "@/controllers/HelpController";
import Help from "@/models/Help";

// Mock Help model
jest.mock("@/models/Help");

describe("HelpController", () => {
  let mockHelpContent;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockHelpContent = {
      sections: [
        {
          title: "¿Cómo agendar una cita?",
          content: "Para agendar una cita, debe seguir los siguientes pasos..."
        },
        {
          title: "¿Qué documentos necesito?",
          content: "Los documentos necesarios son..."
        }
      ]
    };
  });

  describe("getHelpContent", () => {
    it("debería obtener el contenido de ayuda de una página específica", async () => {
      Help.getContent.mockResolvedValue(mockHelpContent);

      const result = await HelpController.getHelpContent("citas");

      expect(result).toEqual(mockHelpContent);
      expect(Help.getContent).toHaveBeenCalledWith("citas");
    });

    it("debería obtener el contenido de ayuda sin especificar página", async () => {
      Help.getContent.mockResolvedValue(mockHelpContent);

      const result = await HelpController.getHelpContent();

      expect(result).toEqual(mockHelpContent);
      expect(Help.getContent).toHaveBeenCalledWith(null);
    });

    it("debería lanzar error si falla la obtención del contenido", async () => {
      Help.getContent.mockRejectedValue(new Error("Error al obtener contenido"));

      await expect(HelpController.getHelpContent("citas"))
        .rejects
        .toThrow("Error al obtener contenido");
    });
  });

  describe("updateHelpContent", () => {
    it("debería actualizar el contenido de una página correctamente", async () => {
      Help.updateContent.mockResolvedValue(true);

      const result = await HelpController.updateHelpContent("citas", mockHelpContent);

      expect(result).toEqual({ ok: true });
      expect(Help.updateContent).toHaveBeenCalledWith("citas", mockHelpContent);
    });

    it("debería lanzar error si falla la actualización", async () => {
      Help.updateContent.mockRejectedValue(new Error("Error de actualización"));

      await expect(HelpController.updateHelpContent("citas", mockHelpContent))
        .rejects
        .toThrow("Error de actualización");
    });
  });

  describe("deletePage", () => {
    it("debería eliminar una página correctamente", async () => {
      Help.deletePage.mockResolvedValue(true);

      const result = await HelpController.deletePage("citas");

      expect(result).toEqual({ ok: true });
      expect(Help.deletePage).toHaveBeenCalledWith("citas");
    });

    it("debería lanzar error si falla la eliminación", async () => {
      Help.deletePage.mockRejectedValue(new Error("Error al eliminar página"));

      await expect(HelpController.deletePage("citas"))
        .rejects
        .toThrow("Error al eliminar página");
    });
  });

  describe("getPages", () => {
    it("debería obtener todas las páginas habilitadas", async () => {
      const mockPages = ["citas", "pagos"];
      Help.getPages.mockResolvedValue(mockPages);

      const result = await HelpController.getPages();

      expect(result).toEqual(mockPages);
      expect(Help.getPages).toHaveBeenCalled();
    });

    it("debería lanzar error si falla la obtención de páginas", async () => {
      Help.getPages.mockRejectedValue(new Error("Error al obtener páginas"));

      await expect(HelpController.getPages())
        .rejects
        .toThrow("Error al obtener páginas");
    });
  });
}); 