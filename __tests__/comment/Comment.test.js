import { ref, get, set, push, remove, update, onValue } from "firebase/database";
import Comment from "@/models/Comment";

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
  update: jest.fn(),
  onValue: jest.fn(),
  getDatabase: jest.fn()
}));

describe("Comment Model", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("create", () => {
    it("debe crear un comentario correctamente", async () => {
      const mockCommentData = {
        content: "Test Comment",
        author: "Test Author",
        authorId: "123",
        authorUid: "uid123",
        authorAvatar: "avatar.jpg",
        entityType: "blog",
        entityId: "blog123"
      };

      const mockNewCommentRef = { key: "comment-id" };
      push.mockReturnValue(mockNewCommentRef);
      update.mockResolvedValue();

      const result = await Comment.create(mockCommentData);

      expect(push).toHaveBeenCalled();
      expect(update).toHaveBeenCalled();
      expect(result).toEqual({
        id: "comment-id",
        content: mockCommentData.content,
        author: mockCommentData.author,
        authorId: mockCommentData.authorId,
        authorUid: mockCommentData.authorUid,
        authorAvatar: mockCommentData.authorAvatar,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it("debe crear un comentario con valores por defecto", async () => {
      const mockCommentData = {
        content: "Test Comment",
        authorId: "123",
        authorUid: "uid123",
        entityType: "blog",
        entityId: "blog123"
      };

      const mockNewCommentRef = { key: "comment-id" };
      push.mockReturnValue(mockNewCommentRef);
      update.mockResolvedValue();

      const result = await Comment.create(mockCommentData);

      expect(result.author).toBe("Usuario");
      expect(result.authorAvatar).toBe("");
    });
  });

  describe("getAll", () => {
    it("debe devolver todos los comentarios ordenados por fecha", async () => {
      const mockComments = {
        "comment1": {
          content: "Comment 1",
          createdAt: "2024-03-20T12:00:00.000Z"
        },
        "comment2": {
          content: "Comment 2",
          createdAt: "2024-03-21T12:00:00.000Z"
        }
      };

      const mockSnapshot = {
        exists: () => true,
        forEach: (callback) => {
          Object.keys(mockComments).forEach((key) => {
            callback({
              key,
              val: () => mockComments[key]
            });
          });
        }
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await Comment.getAll("blog", "blog123");

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("comment1");
      expect(result[1].id).toBe("comment2");
    });

    it("debe devolver array vacío cuando no hay comentarios", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      const result = await Comment.getAll("blog", "blog123");
      expect(result).toEqual([]);
    });
  });

  describe("delete", () => {
    it("debe eliminar un comentario correctamente", async () => {
      const mockCommentData = {
        authorId: "user123",
        content: "Test comment"
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockCommentData
      };

      get.mockResolvedValue(mockSnapshot);
      update.mockResolvedValue();

      const result = await Comment.delete("blog", "blog123", "comment123");

      expect(get).toHaveBeenCalled();
      expect(update).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("debe lanzar error cuando el comentario no existe", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(Comment.delete("blog", "blog123", "nonexistent"))
        .rejects
        .toThrow("Comment not found");
    });
  });

  describe("update", () => {
    it("debe actualizar un comentario correctamente", async () => {
      const mockCommentData = {
        content: "Original content",
        author: "Test Author"
      };

      const mockSnapshot = {
        exists: () => true,
        val: () => mockCommentData
      };

      get.mockResolvedValue(mockSnapshot);
      set.mockResolvedValue();

      const result = await Comment.update("blog", "blog123", "comment123", "Updated content");

      const setCall = set.mock.calls[0];
      expect(setCall[1]).toEqual({
        ...mockCommentData,
        content: "Updated content",
        isEdited: true,
        updatedAt: expect.any(String)
      });
      expect(result).toEqual({ ok: true });
    });

    it("debe lanzar error cuando el comentario no existe", async () => {
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(Comment.update("blog", "blog123", "nonexistent", "content"))
        .rejects
        .toThrow("Comentario no encontrado");
    });
  });

  describe("subscribe", () => {
    it("debe suscribirse a los cambios de comentarios", () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      
      onValue.mockImplementation((ref, callback) => {
        const mockSnapshot = {
          forEach: (cb) => {
            cb({
              key: "comment1",
              val: () => ({
                content: "Test comment",
                createdAt: "2024-03-20T12:00:00.000Z"
              })
            });
          }
        };
        callback(mockSnapshot);
        return mockUnsubscribe;
      });

      const unsubscribe = Comment.subscribe("blog", "blog123", mockCallback);

      expect(onValue).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          id: "comment1",
          content: "Test comment"
        })
      ]));
      expect(typeof unsubscribe).toBe('function');
    });
  });
}); 