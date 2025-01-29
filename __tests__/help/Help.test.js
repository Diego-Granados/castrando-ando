import { db } from "@/lib/firebase/config";
import { ref, get, set } from "firebase/database";
import Help from "@/models/Help";

// Mock Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  child: jest.fn(),
}));

describe("Help", () => {
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
      ],
      enabled: true
    };
  });

  describe("getContent", () => {
    it("debería obtener el contenido de ayuda de una página habilitada", async () => {
      const mockSnapshot = {
        exists: () => true,
        val: () => mockHelpContent
      };
      get.mockResolvedValue(mockSnapshot);

      const result = await Help.getContent("citas");

      expect(result).toEqual({ sections: mockHelpContent.sections });
      expect(ref).toHaveBeenCalledWith(db, "help/citas");
      expect(get).toHaveBeenCalled();
    });

    it("debería retornar secciones vacías si la página no existe", async () => {
      const mockSnapshot = {
        exists: () => false
      };
      get.mockResolvedValue(mockSnapshot);

      const result = await Help.getContent("paginaInexistente");

      expect(result).toEqual({ sections: [] });
    });

    it("debería retornar secciones vacías si la página está deshabilitada", async () => {
      const mockSnapshot = {
        exists: () => true,
        val: () => ({ ...mockHelpContent, enabled: false })
      };
      get.mockResolvedValue(mockSnapshot);

      const result = await Help.getContent("paginaDeshabilitada");

      expect(result).toEqual({ sections: [] });
    });

    it("debería lanzar error si falla la obtención", async () => {
      get.mockRejectedValue(new Error("Error de Firebase"));

      await expect(Help.getContent("citas"))
        .rejects
        .toThrow("Error de Firebase");
    });
  });

  describe("updateContent", () => {
    it("debería actualizar el contenido de una página correctamente", async () => {
      set.mockResolvedValue();

      const result = await Help.updateContent("citas", mockHelpContent);

      expect(result).toBe(true);
      expect(ref).toHaveBeenCalledWith(db, "help/citas");
      expect(set).toHaveBeenCalledWith(
        ref(db, "help/citas"),
        expect.objectContaining({
          sections: mockHelpContent.sections,
          enabled: true
        })
      );
    });

    it("debería lanzar error si falla la actualización", async () => {
      set.mockRejectedValue(new Error("Error de actualización"));

      await expect(Help.updateContent("citas", mockHelpContent))
        .rejects
        .toThrow("Error de actualización");
    });
  });

  describe("deletePage", () => {
    it("debería deshabilitar una página correctamente", async () => {
      set.mockResolvedValue();

      const result = await Help.deletePage("citas");

      expect(result).toBe(true);
      expect(ref).toHaveBeenCalledWith(db, "help/citas");
      expect(set).toHaveBeenCalledWith(
        ref(db, "help/citas"),
        {
          sections: [],
          enabled: false
        }
      );
    });

    it("debería lanzar error si falla el borrado", async () => {
      set.mockRejectedValue(new Error("Error al borrar"));

      await expect(Help.deletePage("citas"))
        .rejects
        .toThrow("Error al borrar");
    });
  });

  describe("getPages", () => {
    it("debería obtener todas las páginas habilitadas", async () => {
      const mockPages = {
        citas: { ...mockHelpContent, enabled: true },
        pagos: { ...mockHelpContent, enabled: true },
        deshabilitada: { ...mockHelpContent, enabled: false }
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockPages
      };
      get.mockResolvedValue(mockSnapshot);

      const result = await Help.getPages();

      expect(result).toEqual(["citas", "pagos"]);
      expect(ref).toHaveBeenCalledWith(db, "help");
    });

    it("debería retornar un arreglo vacío si no hay páginas", async () => {
      const mockSnapshot = {
        exists: () => false
      };
      get.mockResolvedValue(mockSnapshot);

      const result = await Help.getPages();

      expect(result).toEqual([]);
    });

    it("debería lanzar error si falla la obtención de páginas", async () => {
      get.mockRejectedValue(new Error("Error al obtener páginas"));

      await expect(Help.getPages())
        .rejects
        .toThrow("Error al obtener páginas");
    });
  });
}); 