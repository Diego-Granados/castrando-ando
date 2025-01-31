import BlogController from "@/controllers/BlogController";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import AuthController from "@/controllers/AuthController";

// Mock de los modelos
jest.mock("@/models/Blog");
jest.mock("@/models/Comment");
jest.mock("@/controllers/AuthController");

describe("BlogController", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("createBlog", () => {
    it("debe crear un blog cuando el usuario es admin", async () => {
      const mockUser = { uid: "admin123" };
      AuthController.getCurrentUser.mockResolvedValue({ user: mockUser, role: "Admin" });
      
      const mockBlogData = {
        title: "Test Blog",
        content: "Test Content"
      };

      Blog.create.mockResolvedValue({ id: "blog123" });

      const result = await BlogController.createBlog(mockBlogData);

      expect(Blog.create).toHaveBeenCalledWith({
        ...mockBlogData,
        author: "Admin",
        authorId: mockUser.uid,
        createdAt: expect.any(String)
      });
      expect(result).toEqual({ ok: true, id: "blog123" });
    });

    it("debe rechazar la creación cuando el usuario no es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ 
        user: { uid: "user123" }, 
        role: "User" 
      });

      const result = await BlogController.createBlog({ title: "Test" });

      expect(Blog.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        ok: false,
        error: "No tienes permisos para crear blogs"
      });
    });

    it("debe rechazar la creación cuando el usuario no está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ 
        user: null, 
        role: null 
      });

      const result = await BlogController.createBlog({ title: "Test" });

      expect(Blog.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        ok: false,
        error: "Usuario no autenticado"
      });
    });

    it("debe manejar errores durante la creación", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ 
        user: { uid: "admin123" }, 
        role: "Admin" 
      });
      Blog.create.mockRejectedValue(new Error("Error de prueba"));

      const result = await BlogController.createBlog({ title: "Test" });

      expect(result).toEqual({
        ok: false,
        error: "Error al crear el blog"
      });
    });
  });

  describe("getBlogs", () => {
    it("debe obtener todos los blogs", async () => {
      const mockSetBlogs = jest.fn();
      await BlogController.getBlogs(mockSetBlogs);

      expect(Blog.getAll).toHaveBeenCalledWith(mockSetBlogs);
    });

    it("debe manejar errores al obtener blogs", async () => {
      const error = new Error("Error de prueba");
      Blog.getAll.mockRejectedValue(error);

      await expect(BlogController.getBlogs(jest.fn()))
        .rejects
        .toThrow("Error de prueba");
    });
  });

  describe("deleteBlog", () => {
    it("debe eliminar un blog y sus comentarios cuando el usuario es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ 
        user: { uid: "admin123" }, 
        role: "Admin" 
      });
      Comment.deleteAllFromEntity.mockResolvedValue(true);
      Blog.delete.mockResolvedValue(true);

      const result = await BlogController.deleteBlog("blog123");

      expect(Comment.deleteAllFromEntity).toHaveBeenCalledWith('blog', "blog123");
      expect(Blog.delete).toHaveBeenCalledWith("blog123");
      expect(result).toEqual({ ok: true });
    });

    it("debe rechazar la eliminación cuando el usuario no es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ 
        user: { uid: "user123" }, 
        role: "User" 
      });

      const result = await BlogController.deleteBlog("blog123");

      expect(Comment.deleteAllFromEntity).not.toHaveBeenCalled();
      expect(Blog.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        ok: false,
        error: "No tienes permisos para eliminar blogs"
      });
    });

    it("debe rechazar la eliminación cuando el usuario no está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ 
        user: null, 
        role: null 
      });

      const result = await BlogController.deleteBlog("blog123");

      expect(Comment.deleteAllFromEntity).not.toHaveBeenCalled();
      expect(Blog.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        ok: false,
        error: "Usuario no autenticado"
      });
    });

    it("debe manejar errores durante la eliminación", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ 
        user: { uid: "admin123" }, 
        role: "Admin" 
      });
      Blog.delete.mockRejectedValue(new Error("Error de prueba"));

      const result = await BlogController.deleteBlog("blog123");

      expect(result).toEqual({
        ok: false,
        error: "Error al eliminar el blog"
      });
    });
  });


  describe("isUserAdmin", () => {
    it("debe retornar true cuando el usuario es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ role: "Admin" });
      const result = await BlogController.isUserAdmin();
      expect(result).toBe(true);
    });

    it("debe retornar false cuando el usuario no es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ role: "User" });
      const result = await BlogController.isUserAdmin();
      expect(result).toBe(false);
    });

    it("debe manejar errores y retornar false", async () => {
      AuthController.getCurrentUser.mockRejectedValue(new Error("Error de prueba"));
      const result = await BlogController.isUserAdmin();
      expect(result).toBe(false);
    });
  });
}); 