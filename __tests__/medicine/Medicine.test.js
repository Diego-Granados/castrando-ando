import { db } from "@/lib/firebase/config";
import { ref, get, push, update, remove, onValue } from "firebase/database";
import Medicine from "@/models/Medicine";

// Mock Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  push: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  onValue: jest.fn(),
}));

describe("Medicine", () => {
  let mockMedicine;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockMedicine = {
      name: "Meloxicam",
      amount: 1,
      unit: "pastillas",
      weightMultiplier: 10,
      daysOfTreatment: 4
    };
  });

  describe("constructor", () => {
    it("debería crear una instancia de medicina correctamente", () => {
      const medicine = new Medicine({
        id: "OGS2LFl7hKrJTdV2Am0",
        ...mockMedicine
      });

      expect(medicine.name).toBe(mockMedicine.name);
      expect(medicine.amount).toBe(mockMedicine.amount);
      expect(medicine.unit).toBe(mockMedicine.unit);
      expect(medicine.weightMultiplier).toBe(mockMedicine.weightMultiplier);
      expect(medicine.daysOfTreatment).toBe(mockMedicine.daysOfTreatment);
    });

    it("debería lanzar error cuando no tiene nombre", () => {
      expect(() => new Medicine({
        ...mockMedicine,
        name: ""
      })).toThrow("Medicine must have a name");
    });
  });

  describe("getAll", () => {
    it("debería configurar el listener para obtener todas las medicinas", async () => {
      const setMedicines = jest.fn();
      const unsubscribe = jest.fn();
      const mockSnapshot = {
        exists: jest.fn(() => true),
        val: jest.fn(() => ({
          "OGS2LFl7hKrJTdV2Am0": mockMedicine
        }))
      };

      onValue.mockImplementation((ref, callback) => {
        callback(mockSnapshot);
        return unsubscribe;
      });

      const result = await Medicine.getAll(setMedicines);

      expect(ref).toHaveBeenCalledWith(db, "medicines");
      expect(setMedicines).toHaveBeenCalledWith([
        expect.objectContaining({
          id: "OGS2LFl7hKrJTdV2Am0",
          ...mockMedicine
        })
      ]);
      expect(mockSnapshot.exists).toHaveBeenCalled();
      expect(mockSnapshot.val).toHaveBeenCalled();
      expect(result).toBe(unsubscribe);
    });

    it("debería manejar el caso de no existir medicinas", async () => {
      const setMedicines = jest.fn();
      const mockSnapshot = {
        exists: jest.fn(() => false),
        val: jest.fn()
      };

      onValue.mockImplementation((ref, callback) => {
        callback(mockSnapshot);
        return jest.fn();
      });

      await Medicine.getAll(setMedicines);

      expect(setMedicines).toHaveBeenCalledWith([]);
      expect(mockSnapshot.exists).toHaveBeenCalled();
      expect(mockSnapshot.val).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("debería crear una medicina correctamente cuando no existen medicinas", async () => {
      const mockPushRef = { key: "OGS2LFl7hKrJTdV2Am0" };
      const mockSnapshot = {
        exists: jest.fn(() => false),
        val: jest.fn()
      };

      push.mockReturnValue(mockPushRef);
      update.mockResolvedValue();
      get.mockResolvedValue(mockSnapshot);

      const result = await Medicine.create(mockMedicine);

      expect(result).toEqual(new Medicine({
        id: mockPushRef.key,
        ...mockMedicine
      }));
      expect(mockSnapshot.exists).toHaveBeenCalled();
      expect(mockSnapshot.val).not.toHaveBeenCalled();
    });

    it("debería crear una medicina cuando no existe una con el mismo nombre", async () => {
      const mockPushRef = { key: "OGS2LFl7hKrJTdV2Am0" };
      const mockSnapshot = {
        exists: jest.fn(() => true),
        val: jest.fn(() => ({
          "existingId": {
            ...mockMedicine,
            name: "Otro Medicamento"
          }
        }))
      };

      push.mockReturnValue(mockPushRef);
      update.mockResolvedValue();
      get.mockResolvedValue(mockSnapshot);

      const result = await Medicine.create(mockMedicine);

      expect(result).toEqual(new Medicine({
        id: mockPushRef.key,
        ...mockMedicine
      }));
      expect(mockSnapshot.exists).toHaveBeenCalled();
      expect(mockSnapshot.val).toHaveBeenCalled();
    });

    it("debería lanzar error si ya existe una medicina con el mismo nombre", async () => {
      const mockSnapshot = {
        exists: jest.fn(() => true),
        val: jest.fn(() => ({
          "existingId": {
            ...mockMedicine,
            name: mockMedicine.name.toUpperCase() // Test case insensitive
          }
        }))
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(Medicine.create(mockMedicine))
        .rejects
        .toThrow("Ya existe un medicamento con este nombre");
    });

    it("debería lanzar error si falla la creación", async () => {
        const mockSnapshot = {
            exists: jest.fn(() => true),
            val: jest.fn(() => ({
              "existingId": {
                ...mockMedicine,
                name: "Otro Medicamento"
              }
            }))
          };
        get.mockResolvedValue(mockSnapshot);
        push.mockImplementation(() => {
        throw new Error("Error al crear medicina");
      });

      await expect(Medicine.create(mockMedicine))
        .rejects
        .toThrow("Error al crear medicina");
    });
  });

  describe("update", () => {
    it("debería actualizar una medicina cuando no existen otras medicinas", async () => {
      const medicineId = "OGS2LFl7hKrJTdV2Am0";
      const updateData = {
        ...mockMedicine,
        amount: 2
      };
      const mockSnapshot = {
        exists: jest.fn(() => false),
        val: jest.fn()
      };

      update.mockResolvedValue();
      get.mockResolvedValue(mockSnapshot);

      const result = await Medicine.update(medicineId, updateData);

      expect(result).toEqual(new Medicine({
        id: medicineId,
        ...updateData
      }));
      expect(mockSnapshot.exists).toHaveBeenCalled();
      expect(mockSnapshot.val).not.toHaveBeenCalled();
    });

    it("debería actualizar una medicina cuando no existe otra con el mismo nombre", async () => {
      const medicineId = "OGS2LFl7hKrJTdV2Am0";
      const updateData = {
        ...mockMedicine,
        amount: 2
      };
      const mockSnapshot = {
        exists: jest.fn(() => true),
        val: jest.fn(() => ({
          "otherId": {
            ...mockMedicine,
            name: "Otro Medicamento"
          }
        }))
      };

      update.mockResolvedValue();
      get.mockResolvedValue(mockSnapshot);

      const result = await Medicine.update(medicineId, updateData);

      expect(result).toEqual(new Medicine({
        id: medicineId,
        ...updateData
      }));
      expect(mockSnapshot.exists).toHaveBeenCalled();
      expect(mockSnapshot.val).toHaveBeenCalled();
    });

    it("debería lanzar error si existe otra medicina con el mismo nombre", async () => {
      const medicineId = "OGS2LFl7hKrJTdV2Am0";
      const mockSnapshot = {
        exists: jest.fn(() => true),
        val: jest.fn(() => ({
          "otherId": {
            ...mockMedicine,
            name: mockMedicine.name.toUpperCase() // Test case insensitive
          }
        }))
      };

      get.mockResolvedValue(mockSnapshot);

      await expect(Medicine.update(medicineId, mockMedicine))
        .rejects
        .toThrow("Ya existe otro medicamento con este nombre");
    });

    it("debería lanzar error si falla la actualización", async () => {
        const mockSnapshot = {
            exists: jest.fn(() => true),
            val: jest.fn(() => ({
              "existingId": {
                ...mockMedicine,
                name: "Otro Medicamento"
              }
            }))
          };
        get.mockResolvedValue(mockSnapshot);
        update.mockRejectedValue(new Error("Error de actualización"));

      await expect(Medicine.update("OGS2LFl7hKrJTdV2Am0", mockMedicine))
        .rejects
        .toThrow("Error de actualización");
    });
  });

  describe("delete", () => {
    it("debería eliminar una medicina correctamente", async () => {
      remove.mockResolvedValue();

      await Medicine.delete("OGS2LFl7hKrJTdV2Am0");

      expect(ref).toHaveBeenCalledWith(db, "medicines/OGS2LFl7hKrJTdV2Am0");
      expect(remove).toHaveBeenCalled();
    });

    it("debería lanzar error si falla la eliminación", async () => {
      remove.mockRejectedValue(new Error("Error al eliminar"));

      await expect(Medicine.delete("OGS2LFl7hKrJTdV2Am0"))
        .rejects
        .toThrow("Error al eliminar");
    });
  });

  describe("getAllOnce", () => {
    it("debería obtener todas las medicinas una sola vez", async () => {
      const mockSnapshot = {
        exists: jest.fn(() => true),
        val: jest.fn(() => ({
          "OGS2LFl7hKrJTdV2Am0": mockMedicine
        }))
      };
      get.mockResolvedValue(mockSnapshot);

      const result = await Medicine.getAllOnce();

      expect(result).toEqual([
        new Medicine({
          id: "OGS2LFl7hKrJTdV2Am0",
          ...mockMedicine
        })
      ]);
      expect(ref).toHaveBeenCalledWith(db, "medicines");
      expect(mockSnapshot.exists).toHaveBeenCalled();
      expect(mockSnapshot.val).toHaveBeenCalled();
    });

    it("debería retornar un arreglo vacío si no hay medicinas", async () => {
      const mockSnapshot = {
        exists: jest.fn(() => false),
        val: jest.fn()
      };
      get.mockResolvedValue(mockSnapshot);

      const result = await Medicine.getAllOnce();

      expect(result).toEqual([]);
      expect(mockSnapshot.exists).toHaveBeenCalled();
      expect(mockSnapshot.val).not.toHaveBeenCalled();
    });

    it("debería lanzar error si falla la obtención", async () => {
      get.mockRejectedValue(new Error("Error al obtener medicinas"));

      await expect(Medicine.getAllOnce())
        .rejects
        .toThrow("Error al obtener medicinas");
    });
  });
}); 