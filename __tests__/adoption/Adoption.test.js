import { db } from "@/lib/firebase/config";
import { ref, get, update, onValue, push } from "firebase/database";
import Adoption from "@/models/Adoption";

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

describe("Adoption", () => {
  let mockAdoptionData;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAdoptionData = {
      id: "-OH7-8bn96WnRS52yD-R",
      nombre: "Luna",
      edad: "2",
      tipoAnimal: "Perro",
      peso: "2",
      descripcion: "un perrraso re chido",
      contact: "+506 8888-8888",
      location: "San José, Barrio Los Yoses",
      estado: "En proceso",
      photos: [],
      userId: "YRCEDDFSCvWjZcXSuJSWsb1jez22",
      userEmail: "dmm1462003@gmail.com",
      userName: "dmm1462003@gmail.com",
      createdAt: "2025-01-21T08:35:29.568Z",
      enabled: true
    };
  });

  describe("create", () => {
    it("debería crear una adopción exitosamente", async () => {
      const mockPushRef = { key: "adoption-1" };
      push.mockReturnValue(mockPushRef);
      update.mockResolvedValue(undefined);

      await Adoption.create(mockAdoptionData);

      expect(push).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith(
        {},
        {
          [`/adoptions/${mockPushRef.key}`]: mockAdoptionData
        }
      );
    });

    it("debería manejar errores en la creación", async () => {
      push.mockImplementation(() => {
        throw new Error("Failed to create adoption");
      });

      await expect(Adoption.create(mockAdoptionData))
        .rejects
        .toThrow("Failed to create adoption");
    });
  });

  describe("update", () => {
    it("debería actualizar una adopción exitosamente", async () => {
      const adoptionId = "-OH7-8bn96WnRS52yD-R";
      const updates = {
        [`/adoptions/${adoptionId}/estado`]: "Adoptado"
      };

      get.mockResolvedValue({
        exists: () => true
      });
      update.mockResolvedValue(undefined);

      await Adoption.update(adoptionId, updates);

      expect(update).toHaveBeenCalledWith({}, updates);
    });

    it("debería lanzar error si la adopción no existe", async () => {
      get.mockResolvedValue({
        exists: () => false
      });

      await expect(Adoption.update("nonexistent", {}))
        .rejects
        .toThrow("Failed to update adoption");
    });
  });

  describe("delete", () => {
    it("debería deshabilitar una adopción", async () => {
      update.mockResolvedValue(undefined);

      await Adoption.delete("-OH7-8bn96WnRS52yD-R");

      expect(update).toHaveBeenCalledWith(
        {},
        {
          "/adoptions/-OH7-8bn96WnRS52yD-R/enabled": false
        }
      );
    });
  });

  describe("getById", () => {
    it("debería obtener una adopción por ID", async () => {
      const setAdoption = jest.fn();
      const mockUnsubscribe = jest.fn();

      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => ({...mockAdoptionData})
        });
        return mockUnsubscribe;
      });

      const result = await Adoption.getById("adoption-1", setAdoption);

      expect(setAdoption).toHaveBeenCalledWith(expect.any(Adoption));
      expect(typeof result).toBe('function');
    });

    it("debería manejar el caso cuando la adopción no existe", async () => {
      const setAdoption = jest.fn();
      const mockUnsubscribe = jest.fn();

      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => false
        });
        return mockUnsubscribe;
      });

      const result = await Adoption.getById("nonexistent", setAdoption);

      expect(setAdoption).toHaveBeenCalledWith(null);
      expect(typeof result).toBe('function');
    });
  });
}); 