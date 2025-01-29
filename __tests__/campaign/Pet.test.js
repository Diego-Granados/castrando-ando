import Pet from "@/models/Pet";
import { ref, get, child, set, update, onValue, push } from "firebase/database";
import { db } from "@/lib/firebase/config";

// Mock Firebase
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  child: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  onValue: jest.fn(),
  push: jest.fn(),
}));

describe("Pet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("filterEnabled", () => {
    it("debería filtrar mascotas habilitadas", () => {
      const mockPets = {
        "pet-1": { name: "Luna", enabled: true },
        "pet-2": { name: "Max", enabled: false },
        "pet-3": { name: "Bella", enabled: true },
      };

      const result = Pet.filterEnabled(mockPets);

      expect(result).toEqual({
        "pet-1": { name: "Luna", enabled: true },
        "pet-3": { name: "Bella", enabled: true },
      });
    });

    it("debería manejar un objeto vacío", () => {
      const result = Pet.filterEnabled({});
      expect(result).toEqual({});
    });
  });

  describe("create", () => {
    it("debería crear una nueva mascota", async () => {
      const mockPet = {
        age: 10,
        animal: true,
        breed: "Pastor Alemán",
        enabled: true,
        imageUrl:
          "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png",
        name: "Frida",
        priceSpecial: false,
        sex: false,
        weight: 15,
      };

      const mockOwnerId = "owner-1";
      const mockNewPetRef = { key: "pet-1" };

      ref.mockReturnValue("petRef");
      push.mockReturnValue(mockNewPetRef);

      await Pet.create(mockPet, mockOwnerId);

      expect(ref).toHaveBeenCalledWith(db, `pets/${mockOwnerId}`);
      expect(push).toHaveBeenCalledWith("petRef");
      expect(set).toHaveBeenCalledWith(mockNewPetRef, {
        ...mockPet,
        enabled: true,
      });
    });
  });

  describe("getPetsByOwner", () => {
    it("debería obtener las mascotas de un propietario", async () => {
      const mockPets = {
        "-OFEFLrHq-Xfzm1DtrgQ": {
          age: 10,
          animal: true,
          breed: "Pastor Alemán",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png",
          name: "Frida",
          priceSpecial: false,
          sex: false,
          weight: 15,
        },
        "-OFEIBdcPntHjtWyXq4c": {
          age: 10,
          animal: true,
          breed: "Pastor Alemán",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735426764/pets/1735426765034/ranprdididqx0aacjt7w.png",
          name: "Greta",
          priceSpecial: false,
          sex: false,
          weight: 30,
        },
        "-OFEUrsW5c5iahwfqIWa": {
          age: 7,
          animal: false,
          breed: "Pantera",
          enabled: false,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735426809/pets/1735426810317/ao7fuisdlqwggqsn740a.png",
          name: "Bast",
          priceSpecial: false,
          sex: true,
          weight: 13,
        },
        "-OFEXYqi_KOODXF_9eOo": {
          age: 6,
          animal: false,
          breed: "Pantera",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735427505/pets/1735427505196/agobhthnltxdo7uyfjg3.png",
          name: "Wakanda",
          priceSpecial: false,
          sex: false,
          weight: 12,
        },
      };

      const setPets = jest.fn();
      const mockUnsubscribe = jest.fn();

      ref.mockReturnValue("petsRef");
      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => true,
          val: () => mockPets,
        });
        return mockUnsubscribe;
      });

      const result = await Pet.getPetsByOwner("owner-1", setPets);

      expect(ref).toHaveBeenCalledWith(db, "pets/owner-1");
      expect(setPets).toHaveBeenCalledWith({
        "-OFEFLrHq-Xfzm1DtrgQ": {
          age: 10,
          animal: true,
          breed: "Pastor Alemán",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png",
          name: "Frida",
          priceSpecial: false,
          sex: false,
          weight: 15,
        },
        "-OFEIBdcPntHjtWyXq4c": {
          age: 10,
          animal: true,
          breed: "Pastor Alemán",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735426764/pets/1735426765034/ranprdididqx0aacjt7w.png",
          name: "Greta",
          priceSpecial: false,
          sex: false,
          weight: 30,
        },
        "-OFEXYqi_KOODXF_9eOo": {
          age: 6,
          animal: false,
          breed: "Pantera",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735427505/pets/1735427505196/agobhthnltxdo7uyfjg3.png",
          name: "Wakanda",
          priceSpecial: false,
          sex: false,
          weight: 12,
        },
      });
      expect(result).toBe(mockUnsubscribe);
    });

    it("debería manejar el caso cuando no hay mascotas", async () => {
      const setPets = jest.fn();
      const mockUnsubscribe = jest.fn();

      ref.mockReturnValue("petsRef");
      onValue.mockImplementation((ref, callback) => {
        callback({
          exists: () => false,
        });
        return mockUnsubscribe;
      });

      const result = await Pet.getPetsByOwner("owner-1", setPets);

      expect(setPets).not.toHaveBeenCalled();
      expect(result).toBe(mockUnsubscribe);
    });
  });

  describe("getPetsByOwnerOnce", () => {
    it("debería obtener las mascotas de un propietario una vez", async () => {
      const mockPets = {
        "-OFEFLrHq-Xfzm1DtrgQ": {
          age: 10,
          animal: true,
          breed: "Pastor Alemán",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png",
          name: "Frida",
          priceSpecial: false,
          sex: false,
          weight: 15,
        },
        "-OFEIBdcPntHjtWyXq4c": {
          age: 10,
          animal: true,
          breed: "Pastor Alemán",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735426764/pets/1735426765034/ranprdididqx0aacjt7w.png",
          name: "Greta",
          priceSpecial: false,
          sex: false,
          weight: 30,
        },
        "-OFEUrsW5c5iahwfqIWa": {
          age: 7,
          animal: false,
          breed: "Pantera",
          enabled: false,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735426809/pets/1735426810317/ao7fuisdlqwggqsn740a.png",
          name: "Bast",
          priceSpecial: false,
          sex: true,
          weight: 13,
        },
        "-OFEXYqi_KOODXF_9eOo": {
          age: 6,
          animal: false,
          breed: "Pantera",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735427505/pets/1735427505196/agobhthnltxdo7uyfjg3.png",
          name: "Wakanda",
          priceSpecial: false,
          sex: false,
          weight: 12,
        },
      };

      ref.mockReturnValue("petsRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => mockPets,
      });

      const result = await Pet.getPetsByOwnerOnce("owner-1");

      expect(ref).toHaveBeenCalledWith(db, "pets/owner-1");
      expect(result).toEqual({
        "-OFEFLrHq-Xfzm1DtrgQ": {
          age: 10,
          animal: true,
          breed: "Pastor Alemán",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png",
          name: "Frida",
          priceSpecial: false,
          sex: false,
          weight: 15,
        },
        "-OFEIBdcPntHjtWyXq4c": {
          age: 10,
          animal: true,
          breed: "Pastor Alemán",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735426764/pets/1735426765034/ranprdididqx0aacjt7w.png",
          name: "Greta",
          priceSpecial: false,
          sex: false,
          weight: 30,
        },
        "-OFEXYqi_KOODXF_9eOo": {
          age: 6,
          animal: false,
          breed: "Pantera",
          enabled: true,
          imageUrl:
            "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735427505/pets/1735427505196/agobhthnltxdo7uyfjg3.png",
          name: "Wakanda",
          priceSpecial: false,
          sex: false,
          weight: 12,
        },
      });
    });

    it("debería retornar un objeto vacío cuando no hay mascotas", async () => {
      ref.mockReturnValue("petsRef");
      get.mockResolvedValue({
        exists: () => false,
      });

      const result = await Pet.getPetsByOwnerOnce("owner-1");

      expect(result).toEqual({});
    });
  });

  describe("update", () => {
    it("debería actualizar una mascota", async () => {
      const mockUpdates = {
        age: 10,
        animal: true,
        breed: "Pastor Alemán",
        imageUrl:
          "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png",
        name: "Frida",
        priceSpecial: false,
        sex: false,
        weight: 20,
      };

      ref.mockReturnValue("petRef");

      await Pet.update("pet-1", "owner-1", mockUpdates);

      expect(ref).toHaveBeenCalledWith(db, "pets/owner-1/pet-1");
      expect(set).toHaveBeenCalledWith("petRef", {
        ...mockUpdates,
        enabled: true,
      });
    });
  });

  describe("delete", () => {
    it("debería marcar una mascota como deshabilitada", async () => {
      ref.mockReturnValue("dbRef");

      await Pet.delete("pet-1", "owner-1");

      expect(update).toHaveBeenCalledWith("dbRef", {
        "pets/owner-1/pet-1/enabled": false,
      });
    });
  });

  describe("deleteImage", () => {
    it("debería eliminar la imagen de una mascota", async () => {
      ref.mockReturnValue("dbRef");

      await Pet.deleteImage("pet-1", "owner-1", "image-url");

      expect(update).toHaveBeenCalledWith("dbRef", {
        "pets/owner-1/pet-1/imageUrl": "",
      });
    });
  });
});
