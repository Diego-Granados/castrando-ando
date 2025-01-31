import StorageController from "@/controllers/StorageController";
import Storage from "@/models/Storage";

// Mock Storage model
jest.mock("@/models/Storage");

describe("StorageController", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("uploadFiles", () => {
    const mockPath = "test-path";
    const mockFiles = [
      new File(["test1"], "test1.jpg", { type: "image/jpeg" }),
      new File(["test2"], "test2.jpg", { type: "image/jpeg" }),
      new File(["test3"], "test3.jpg", { type: "image/jpeg" }),
    ];

    it("debería subir múltiples archivos exitosamente", async () => {
      // Mock successful uploads
      const mockUrls = [
        "https://example.com/test1.jpg",
        "https://example.com/test2.jpg",
        "https://example.com/test3.jpg",
      ];

      mockFiles.forEach((_, index) => {
        Storage.uploadFile.mockResolvedValueOnce(mockUrls[index]);
      });

      const result = await StorageController.uploadFiles(mockFiles, mockPath);

      expect(Storage.uploadFile).toHaveBeenCalledTimes(mockFiles.length);
      mockFiles.forEach((file, index) => {
        expect(Storage.uploadFile).toHaveBeenNthCalledWith(
          index + 1,
          file,
          mockPath
        );
      });
      expect(result).toEqual(mockUrls);
    });

    it("debería manejar error en la subida de un archivo", async () => {
      // Mock error on second file upload
      Storage.uploadFile
        .mockResolvedValueOnce("https://example.com/test1.jpg")
        .mockRejectedValueOnce(new Error("Upload failed"))
        .mockResolvedValueOnce("https://example.com/test3.jpg");

      await expect(
        StorageController.uploadFiles(mockFiles, mockPath)
      ).rejects.toThrow("Error uploading file test2.jpg: Upload failed");

      expect(Storage.uploadFile).toHaveBeenCalledTimes(2);
      expect(Storage.uploadFile).toHaveBeenCalledWith(mockFiles[0], mockPath);
      expect(Storage.uploadFile).toHaveBeenCalledWith(mockFiles[1], mockPath);
    });

    it("debería manejar lista de archivos vacía", async () => {
      const result = await StorageController.uploadFiles([], mockPath);

      expect(result).toEqual([]);
      expect(Storage.uploadFile).not.toHaveBeenCalled();
    });
  });

  describe("deleteFiles", () => {
    const mockUrls = [
      "https://example.com/test1.jpg",
      "https://example.com/test2.jpg",
      "https://example.com/test3.jpg",
    ];

    it("debería eliminar múltiples archivos exitosamente", async () => {
      // Mock successful deletions
      mockUrls.forEach(() => {
        Storage.deleteFile.mockResolvedValueOnce(undefined);
      });

      await StorageController.deleteFiles(mockUrls);

      expect(Storage.deleteFile).toHaveBeenCalledTimes(mockUrls.length);
      mockUrls.forEach((url, index) => {
        expect(Storage.deleteFile).toHaveBeenNthCalledWith(index + 1, url);
      });
    });

    it("debería manejar lista de URLs vacía", async () => {
      await StorageController.deleteFiles([]);

      expect(Storage.deleteFile).not.toHaveBeenCalled();
    });

    it("debería procesar URLs inválidas", async () => {
      const invalidUrls = ["invalid-url-1", "invalid-url-2"];

      await StorageController.deleteFiles(invalidUrls);

      expect(Storage.deleteFile).toHaveBeenCalledTimes(invalidUrls.length);
      invalidUrls.forEach((url) => {
        expect(Storage.deleteFile).toHaveBeenCalledWith(url);
      });
    });
  });
});
