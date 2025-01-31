import { db } from "@/lib/firebase/config";
import { ref, get, update, onValue, push } from "firebase/database";
import LostPet from "@/models/LostPet";

// Mock Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(() => ({})),
  get: jest.fn(),
  update: jest.fn(),
  onValue: jest.fn(),
  push: jest.fn(),
}));

describe("LostPet", () => {
  let mockLostPetData;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLostPetData = {
      tipoAnimal: "Perro",
      status: "Perdido",
      descripcion: "Perro pequeño color café",
      location: "San José, Costa Rica",
      contact: "70077997",
      photos: ["photo1.jpg", "photo2.jpg"],
      userId: "YRCEDDFSCvWjZcXSuJSWsb1jez22",
      userEmail: "dmm1462003@gmail.com",
      userName: "dmm1462003@gmail.com",
      createdAt: "2025-01-22T17:51:59.512Z",
      enabled: true
    };
  });

  describe("constructor and validation", () => {
    it("debería crear una instancia válida de LostPet", () => {
      const lostPet = new LostPet({ ...mockLostPetData, id: "pet-1" });
      expect(lostPet).toBeInstanceOf(LostPet);
    });

    it("debería lanzar error si faltan campos requeridos", () => {
      expect(() => new LostPet({ ...mockLostPetData, tipoAnimal: null }))
        .toThrow("Lost pet must have an animal type");
      expect(() => new LostPet({ ...mockLostPetData, status: null }))
        .toThrow("Lost pet must have a status");
      expect(() => new LostPet({ ...mockLostPetData, descripcion: null }))
        .toThrow("Lost pet must have a description");
    });
  });

  describe("create", () => {
    it("debería crear una mascota perdida exitosamente", async () => {
      const mockPushRef = { key: "-OHeDECkGQz6IBiD-fnM" };
      push.mockReturnValue(mockPushRef);
      update.mockResolvedValue(undefined);

      const result = await LostPet.create(mockLostPetData);

      expect(result).toBe("-OHeDECkGQz6IBiD-fnM");
      expect(push).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith(
        {},
        {
          [`/lostPets/${mockPushRef.key}`]: mockLostPetData
        }
      );
    });

    it("debería manejar errores en la creación", async () => {
      push.mockImplementation(() => {
        throw new Error("Failed to create lost pet");
      });

      await expect(LostPet.create(mockLostPetData))
        .rejects
        .toThrow("Failed to create lost pet");
    });
  });

  describe("update", () => {
    it("debería actualizar una mascota perdida exitosamente", async () => {
      const petId = "-OHeDECkGQz6IBiD-fnM";
      const updates = {
        [`/lostPets/${petId}/status`]: "Encontrado"
      };

      get.mockResolvedValue({
        exists: () => true
      });
      update.mockResolvedValue(undefined);

      await LostPet.update(petId, updates);

      expect(update).toHaveBeenCalledWith({}, updates);
    });

    it("debería lanzar error si la mascota no existe", async () => {
      get.mockResolvedValue({
        exists: () => false
      });

      await expect(LostPet.update("nonexistent", {}))
        .rejects
        .toThrow("Failed to update lost pet");
    });
  });

  describe("delete", () => {
    it("debería deshabilitar una mascota perdida", async () => {
      update.mockResolvedValue(undefined);

      await LostPet.delete("-OHeDECkGQz6IBiD-fnM");

      expect(update).toHaveBeenCalledWith(
        {},
        {
          "/lostPets/-OHeDECkGQz6IBiD-fnM/enabled": false
        }
      );
    });
  });

  describe("getById", () => {
    it("debería obtener una mascota perdida por ID", async () => {
      const setPet = jest.fn();
      const mockUnsubscribe = jest.fn();

      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => ({...mockLostPetData})
        });
        return mockUnsubscribe;
      });

      const result = await LostPet.getById("-OHeDECkGQz6IBiD-fnM", setPet);

      expect(setPet).toHaveBeenCalledWith(expect.any(LostPet));
      expect(typeof result).toBe('function');
    });

    it("debería manejar el caso cuando la mascota no existe", async () => {
      const setPet = jest.fn();
      const mockUnsubscribe = jest.fn();

      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => false
        });
        return mockUnsubscribe;
      });

      const result = await LostPet.getById("nonexistent", setPet);

      expect(setPet).toHaveBeenCalledWith(null);
      expect(typeof result).toBe('function');
    });
  });
}); 