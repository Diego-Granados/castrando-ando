import CommentController from "@/controllers/CommentController";
import Comment from "@/models/Comment";
import AuthController from "@/controllers/AuthController";

// Mock de los modelos
jest.mock("@/models/Comment");
jest.mock("@/controllers/AuthController");

describe("CommentController", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("createComment", () => {
    it("debe crear un comentario como admin", async () => {
      const mockCommentData = {
        entityType: "blog",
        entityId: "blog123",
        content: "Test comment",
        author: "Admin",
        authorId: "admin"
      };

      Comment.create.mockResolvedValue({
        id: "comment123",
        ...mockCommentData
      });

      const result = await CommentController.createComment(mockCommentData);

      expect(Comment.create).toHaveBeenCalledWith({
        ...mockCommentData,
        authorUid: "admin",
        authorAvatar: ""
      });
      expect(result).toEqual({
        ok: true,
        comment: expect.objectContaining({ id: "comment123" })
      });
    });


    it("debe rechazar la creación si faltan datos requeridos", async () => {
      const result = await CommentController.createComment({
        content: "Test comment"
      });

      expect(Comment.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        ok: false,
        error: "Faltan datos requeridos"
      });
    });

    it("debe rechazar la creación si el usuario no está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ user: null });

      const result = await CommentController.createComment({
        entityType: "blog",
        entityId: "blog123",
        content: "Test comment"
      });

      expect(result).toEqual({
        ok: false,
        error: "Debes iniciar sesión para comentar"
      });
    });
  });

  describe("getComments", () => {
    it("debe obtener comentarios y suscribirse a cambios", async () => {
      const mockComments = [
        { id: "comment1", content: "Comment 1" },
        { id: "comment2", content: "Comment 2" }
      ];
      const mockSetComments = jest.fn();
      const mockUnsubscribe = jest.fn();

      Comment.getAll.mockResolvedValue(mockComments);
      Comment.subscribe.mockReturnValue(mockUnsubscribe);

      const unsubscribe = await CommentController.getComments(
        "blog",
        "blog123",
        mockSetComments
      );

      expect(Comment.getAll).toHaveBeenCalledWith("blog", "blog123");
      expect(mockSetComments).toHaveBeenCalledWith(mockComments);
      expect(Comment.subscribe).toHaveBeenCalledWith("blog", "blog123", mockSetComments);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it("debe manejar errores al obtener comentarios", async () => {
      const error = new Error("Error de prueba");
      Comment.getAll.mockRejectedValue(error);

      await expect(
        CommentController.getComments("blog", "blog123", jest.fn())
      ).rejects.toThrow("Error de prueba");
    });
  });

  describe("updateComment", () => {
    it("debe permitir que un admin actualice cualquier comentario", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "admin123" },
        role: "Admin"
      });

      Comment.update.mockResolvedValue({ ok: true });

      const result = await CommentController.updateComment(
        "blog",
        "blog123",
        "comment123",
        "Updated content"
      );

      expect(Comment.update).toHaveBeenCalledWith(
        "blog",
        "blog123",
        "comment123",
        "Updated content"
      );
      expect(result.ok).toBe(true);
    });

    it("debe permitir que un usuario actualice su propio comentario", async () => {
      const mockUser = { uid: "user123" };
      AuthController.getCurrentUser.mockResolvedValue({
        user: mockUser,
        role: "User"
      });

      Comment.get.mockResolvedValue({
        id: "comment123",
        authorId: mockUser.uid
      });

      Comment.update.mockResolvedValue({ ok: true });

      const result = await CommentController.updateComment(
        "blog",
        "blog123",
        "comment123",
        "Updated content"
      );

      expect(result.ok).toBe(true);
    });

    it("debe rechazar la actualización si el usuario no está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ user: null });

      const result = await CommentController.updateComment(
        "blog",
        "blog123",
        "comment123",
        "Updated content"
      );

      expect(result).toEqual({
        ok: false,
        error: "Usuario no autenticado"
      });
    });
  });

  describe("deleteComment", () => {
    it("debe permitir que un admin elimine cualquier comentario", async () => {
      Comment.delete.mockResolvedValue(true);

      const result = await CommentController.deleteComment(
        "blog",
        "blog123",
        "comment123",
        true
      );

      expect(Comment.delete).toHaveBeenCalledWith("blog", "blog123", "comment123");
      expect(result.ok).toBe(true);
    });

    it("debe permitir que un usuario elimine su propio comentario", async () => {
      const mockUser = { uid: "user123" };
      AuthController.getCurrentUser.mockResolvedValue({ user: mockUser });

      Comment.get.mockResolvedValue({
        id: "comment123",
        authorUid: mockUser.uid
      });

      Comment.delete.mockResolvedValue(true);

      const result = await CommentController.deleteComment(
        "blog",
        "blog123",
        "comment123"
      );

      expect(result.ok).toBe(true);
    });

    it("debe rechazar la eliminación si el usuario no está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ user: null });

      const result = await CommentController.deleteComment(
        "blog",
        "blog123",
        "comment123"
      );

      expect(result).toEqual({
        ok: false,
        error: "Usuario no autenticado"
      });
    });
  });

  describe("toggleLike", () => {
    it("debe permitir dar/quitar like si el usuario está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "user123" }
      });

      Comment.toggleLike.mockResolvedValue({ ok: true });

      const result = await CommentController.toggleLike(
        "blog",
        "blog123",
        "comment123"
      );

      expect(Comment.toggleLike).toHaveBeenCalledWith(
        "blog",
        "blog123",
        "comment123"
      );
      expect(result.ok).toBe(true);
    });

    it("debe rechazar el like si el usuario no está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ user: null });

      const result = await CommentController.toggleLike(
        "blog",
        "blog123",
        "comment123"
      );

      expect(result).toEqual({
        ok: false,
        error: "Usuario no autenticado"
      });
    });
  });

  describe("Métodos de verificación", () => {
    it("debe verificar si el usuario está autenticado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ user: { uid: "user123" } });
      const result = await CommentController.isUserAuthenticated();
      expect(result).toBe(true);
    });

    it("debe verificar si el usuario es admin", async () => {
      AuthController.getCurrentUser.mockResolvedValue({ role: "Admin" });
      const result = await CommentController.isUserAdmin();
      expect(result).toBe(true);
    });

    it("debe manejar errores en la verificación de admin", async () => {
      AuthController.getCurrentUser.mockRejectedValue(new Error("Error de prueba"));
      const result = await CommentController.isUserAdmin();
      expect(result).toBe(false);
    });
  });
}); 