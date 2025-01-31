import Storage from "@/models/Storage";
import { v2 as cloudinary } from "cloudinary";

// Mock cloudinary
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      destroy: jest.fn(),
    },
  },
}));

// Mock global fetch
global.fetch = jest.fn();
global.FormData = jest.fn(() => ({
  append: jest.fn(),
}));

describe("Storage", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("uploadFile", () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockPath = "test-path";
    const mockCloudinaryResponse = {
      secure_url: "https://res.cloudinary.com/demo/image/upload/test.jpg",
    };

    it("debería subir un archivo exitosamente", async () => {
      // Create a mock FormData instance
      const mockFormData = {
        append: jest.fn(),
      };
      FormData.mockImplementation(() => mockFormData);

      // Mock successful fetch response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCloudinaryResponse),
      });

      const result = await Storage.uploadFile(mockFile, mockPath);

      // Verify FormData was created with correct parameters
      expect(FormData).toHaveBeenCalled();
      expect(mockFormData.append).toHaveBeenCalledWith("file", mockFile);
      expect(mockFormData.append).toHaveBeenCalledWith("folder", mockPath);
      expect(mockFormData.append).toHaveBeenCalledWith(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      // Verify fetch was called with correct URL and options
      expect(fetch).toHaveBeenCalledWith(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: mockFormData,
        }
      );

      expect(result).toBe(
        "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/test.jpg"
      );
    });

    it("debería manejar error de respuesta no exitosa", async () => {
      // Mock failed fetch response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      });

      await expect(Storage.uploadFile(mockFile, mockPath)).rejects.toThrow(
        "Error uploading file: Bad Request"
      );
    });

    it("debería manejar error de red", async () => {
      // Mock network error
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(Storage.uploadFile(mockFile, mockPath)).rejects.toThrow(
        "Error uploading file: Network error"
      );
    });

    it("debería manejar error en la respuesta JSON", async () => {
      // Mock JSON parsing error
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(Storage.uploadFile(mockFile, mockPath)).rejects.toThrow(
        "Error uploading file: Invalid JSON"
      );
    });
  });

  describe("extractPublicId", () => {
    it("debería extraer el public_id de una URL normal", () => {
      const url =
        "https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg";
      const result = Storage.extractPublicId(url);
      expect(result).toBe("folder/image");
    });

    it("debería extraer el public_id de una URL optimizada", () => {
      const url =
        "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1234567890/folder/image.jpg";
      const result = Storage.extractPublicId(url);
      expect(result).toBe("folder/image");
    });

    it("debería manejar URLs sin versión", () => {
      const url =
        "https://res.cloudinary.com/demo/image/upload/folder/image.jpg";
      const result = Storage.extractPublicId(url);
      expect(result).toBe("folder/image");
    });

    it("debería manejar URLs con parámetros de transformación", () => {
      const url =
        "https://res.cloudinary.com/demo/image/upload/c_crop,g_face/v1234567890/folder/image.jpg";
      const result = Storage.extractPublicId(url);
      expect(result).toBe("c_crop,g_face/folder/image");
    });
  });

  describe("deleteFile", () => {
    const mockUrl =
      "https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg";

    it("debería eliminar un archivo exitosamente", async () => {
      // Mock successful deletion
      cloudinary.uploader.destroy.mockResolvedValueOnce({ result: "ok" });

      await Storage.deleteFile(mockUrl);

      // Verify destroy was called with correct public_id
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/image");
    });

    it("debería manejar error en la eliminación", async () => {
      // Mock deletion error
      const error = new Error("Deletion failed");
      cloudinary.uploader.destroy.mockRejectedValueOnce(error);

      // The method handles errors silently, so we just verify it doesn't throw
      await expect(Storage.deleteFile(mockUrl)).resolves.toBeUndefined();
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/image");
    });

    it("debería manejar URLs optimizadas", async () => {
      const optimizedUrl =
        "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1234567890/folder/image.jpg";

      await Storage.deleteFile(optimizedUrl);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/image");
    });
  });
});
