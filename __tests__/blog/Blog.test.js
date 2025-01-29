import { ref, get, set, push, remove } from "firebase/database";
import Blog from "@/models/Blog";
import { db } from "@/lib/firebase/config";

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
  getDatabase: jest.fn()
}));

// Mock de fetch para eliminación de imágenes
global.fetch = jest.fn();

describe("Blog Model", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    // Espiar console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar console.error después de cada prueba
    consoleErrorSpy.mockRestore();
  });

  describe("create", () => {
    it("debe crear un blog correctamente", async () => {
      const mockBlogData = {
        title: "Test Blog",
        content: "Test Content",
        imageUrl: "http://example.com/image.jpg",
        author: "Test Author",
        authorId: "123",
        date: "2024-03-20",
        createdAt: "2024-03-20T12:00:00.000Z"
      };

      const mockNewBlogRef = { key: "mock-blog-id" };
      push.mockReturnValue(mockNewBlogRef);
      set.mockResolvedValue();

      const result = await Blog.create(mockBlogData);

      expect(push).toHaveBeenCalled();
      expect(set).toHaveBeenCalledWith(mockNewBlogRef, mockBlogData);
      expect(result).toEqual({ id: "mock-blog-id" });
    });

    it("debe crear un blog correctamente con valores por defecto cuando faltan campos opcionales", async () => {
      const mockBlogData = {
        title: "Test Blog",
        content: "Test Content",
        authorId: "123"
      };

      const mockNewBlogRef = { key: "mock-blog-id" };
      push.mockReturnValue(mockNewBlogRef);
      set.mockResolvedValue();

      await Blog.create(mockBlogData);

      expect(set).toHaveBeenCalledWith(
        mockNewBlogRef,
        expect.objectContaining({
          title: "Test Blog",
          content: "Test Content",
          imageUrl: "",
          author: "Admin",
          authorId: "123",
          date: expect.any(String),
          createdAt: expect.any(String)
        })
      );
    });

    it("debe manejar errores durante la creación del blog", async () => {
      const error = new Error("Error de Firebase");
      push.mockImplementation(() => {
        throw error;
      });

      const mockBlogData = {
        title: "Test Blog",
        content: "Test Content",
        authorId: "123"
      };

      await expect(Blog.create(mockBlogData)).rejects.toThrow("Error de Firebase");
    });
  });

  describe("getAll", () => {
    it("debe devolver todos los blogs ordenados por fecha", async () => {
      const mockBlogs = {
        "blog1": {
          title: "Blog 1",
          createdAt: "2024-03-20T12:00:00.000Z"
        },
        "blog2": {
          title: "Blog 2",
          createdAt: "2024-03-21T12:00:00.000Z"
        }
      };

      const mockSnapshot = {
        exists: () => true,
        forEach: (callback) => {
          Object.keys(mockBlogs).forEach((key) => {
            callback({
              key,
              val: () => mockBlogs[key]
            });
          });
        }
      };

      get.mockResolvedValue(mockSnapshot);
      const setBlogs = jest.fn();

      await Blog.getAll(setBlogs);

      expect(setBlogs).toHaveBeenCalledWith([
        { id: "blog2", ...mockBlogs["blog2"] },
        { id: "blog1", ...mockBlogs["blog1"] }
      ]);
    });

    it("debe devolver un array vacío cuando no hay blogs", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);
      const setBlogs = jest.fn();

      await Blog.getAll(setBlogs);

      expect(setBlogs).toHaveBeenCalledWith([]);
    });
  });

  describe("delete", () => {
    it("debe eliminar un blog correctamente", async () => {
      const blogId = "test-blog-id";
      const mockBlogData = {
        imageUrl: "http://example.com/image.jpg"
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockBlogData
      };

      get.mockResolvedValue(mockSnapshot);
      remove.mockResolvedValue();
      global.fetch.mockResolvedValue({
        ok: true
      });

      const result = await Blog.delete(blogId);

      expect(get).toHaveBeenCalled();
      expect(remove).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith('/api/storage/delete', expect.any(Object));
      expect(result).toBe(true);
    });

    it("debe lanzar error cuando no se proporciona el ID del blog", async () => {
      await expect(Blog.delete()).rejects.toThrow("ID del blog requerido");
    });

    it("debe lanzar error cuando el blog no existe", async () => {
      const blogId = "non-existent-id";
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(Blog.delete(blogId)).rejects.toThrow("El blog no existe");
    });
  });
});