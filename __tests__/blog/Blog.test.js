import { ref, get, set, push, remove } from "firebase/database";
import Blog from "@/models/Blog";
import { db } from "@/lib/firebase/config";

// Mock Firebase configuration
jest.mock("@/lib/firebase/config", () => ({
  db: {},
  auth: {},
  storage: {}
}));

// Mock Firebase functions
jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  push: jest.fn(),
  remove: jest.fn(),
  getDatabase: jest.fn()
}));

// Mock fetch for image deletion
global.fetch = jest.fn();

describe("Blog Model", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Spy on console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  describe("create", () => {
    it("should create a new blog successfully", async () => {
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

    it("should create a blog with default values when optional fields are missing", async () => {
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

    it("should handle errors during blog creation", async () => {
      const error = new Error("Firebase error");
      push.mockImplementation(() => {
        throw error;
      });

      const mockBlogData = {
        title: "Test Blog",
        content: "Test Content",
        authorId: "123"
      };

      await expect(Blog.create(mockBlogData)).rejects.toThrow("Firebase error");
    });
  });

  describe("getAll", () => {
    it("should return all blogs sorted by date", async () => {
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

    it("should return empty array when no blogs exist", async () => {
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
    it("should delete a blog successfully", async () => {
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

    it("should throw error when blog id is not provided", async () => {
      await expect(Blog.delete()).rejects.toThrow("ID del blog requerido");
    });

    it("should throw error when blog does not exist", async () => {
      const blogId = "non-existent-id";
      const mockSnapshot = {
        exists: () => false
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(Blog.delete(blogId)).rejects.toThrow("El blog no existe");
    });
  });
});