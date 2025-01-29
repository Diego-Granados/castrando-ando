import PetController from "@/controllers/PetController";
import Pet from "@/models/Pet";
import AuthController from "@/controllers/AuthController";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/models/Pet");
jest.mock("@/controllers/AuthController");
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => data),
    error: jest.fn((message, status) => ({ error: message, status })),
  },
}));

describe("PetController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe("getPets", () => {
    it("debería obtener mascotas del usuario actual", async () => {
      const mockUserId = "user-1";
      const setPets = jest.fn();
      const mockUnsubscribe = jest.fn();

      AuthController.getUserId.mockResolvedValue(mockUserId);
      Pet.getPetsByOwner.mockResolvedValue(mockUnsubscribe);

      const result = await PetController.getPets(setPets);

      expect(AuthController.getUserId).toHaveBeenCalled();
      expect(Pet.getPetsByOwner).toHaveBeenCalledWith(mockUserId, setPets);
      expect(result).toBe(mockUnsubscribe);
    });

    it("debería obtener mascotas de un usuario específico", async () => {
      const mockUserId = "user-2";
      const setPets = jest.fn();
      const mockUnsubscribe = jest.fn();

      Pet.getPetsByOwner.mockResolvedValue(mockUnsubscribe);

      const result = await PetController.getPets(setPets, mockUserId);

      expect(AuthController.getUserId).not.toHaveBeenCalled();
      expect(Pet.getPetsByOwner).toHaveBeenCalledWith(mockUserId, setPets);
      expect(result).toBe(mockUnsubscribe);
    });
  });

  describe("getPetsOnce", () => {
    it("debería obtener mascotas del usuario actual una vez", async () => {
      const mockUserId = "user-1";
      const mockPets = {
        "pet-1": {
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
      };

      AuthController.getUserId.mockResolvedValue(mockUserId);
      Pet.getPetsByOwnerOnce.mockResolvedValue(mockPets);

      const result = await PetController.getPetsOnce();

      expect(AuthController.getUserId).toHaveBeenCalled();
      expect(Pet.getPetsByOwnerOnce).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockPets);
    });

    it("debería obtener mascotas de un usuario específico una vez", async () => {
      const mockUserId = "user-2";
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

      Pet.getPetsByOwnerOnce.mockResolvedValue(mockPets);

      const result = await PetController.getPetsOnce(mockUserId);

      expect(AuthController.getUserId).not.toHaveBeenCalled();
      expect(Pet.getPetsByOwnerOnce).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockPets);
    });
  });

  describe("create", () => {
    it("debería crear una nueva mascota", async () => {
      const mockUserId = "user-1";
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

      AuthController.getUserId.mockResolvedValue(mockUserId);

      await PetController.create(mockPet);

      expect(AuthController.getUserId).toHaveBeenCalled();
      expect(Pet.create).toHaveBeenCalledWith(mockPet, mockUserId);
    });
  });

  describe("update", () => {
    it("debería actualizar una mascota sin imagen anterior", async () => {
      const mockUserId = "user-1";
      const mockPetId = "pet-1";
      const mockUpdates = {
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

      AuthController.getUserId.mockResolvedValue(mockUserId);

      await PetController.update(mockPetId, mockUpdates);

      expect(AuthController.getUserId).toHaveBeenCalled();
      expect(Pet.update).toHaveBeenCalledWith(
        mockPetId,
        mockUserId,
        mockUpdates
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("debería actualizar una mascota y eliminar la imagen anterior", async () => {
      const mockUserId = "user-1";
      const mockPetId = "pet-1";
      const mockUpdates = {
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
      const oldImageUrl =
        "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png";

      AuthController.getUserId.mockResolvedValue(mockUserId);
      global.fetch.mockResolvedValue({ ok: true });

      await PetController.update(mockPetId, mockUpdates, oldImageUrl);

      expect(AuthController.getUserId).toHaveBeenCalled();
      expect(Pet.update).toHaveBeenCalledWith(
        mockPetId,
        mockUserId,
        mockUpdates
      );
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/storage/delete",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [oldImageUrl] }),
        })
      );
    });
  });

  describe("delete", () => {
    it("debería eliminar una mascota y su imagen", async () => {
      const mockUserId = "user-1";
      const mockPetId = "pet-1";
      const mockImageUrl =
        "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png";

      AuthController.getUserId.mockResolvedValue(mockUserId);
      global.fetch.mockResolvedValue({ ok: true });

      await PetController.delete(mockPetId, mockImageUrl);

      expect(AuthController.getUserId).toHaveBeenCalled();
      expect(Pet.delete).toHaveBeenCalledWith(mockPetId, mockUserId);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/storage/delete",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [mockImageUrl] }),
        })
      );
    });
  });

  describe("deleteImage", () => {
    it("debería eliminar la imagen de una mascota exitosamente", async () => {
      const mockUserId = "user-1";
      const mockPetId = "pet-1";
      const mockImageUrl =
        "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png";

      AuthController.getUserId.mockResolvedValue(mockUserId);
      global.fetch.mockResolvedValue({ ok: true });

      const result = await PetController.deleteImage(mockPetId, mockImageUrl);

      expect(AuthController.getUserId).toHaveBeenCalled();
      expect(Pet.deleteImage).toHaveBeenCalledWith(
        mockPetId,
        mockUserId,
        mockImageUrl
      );
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/storage/delete",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [mockImageUrl] }),
        })
      );
      expect(result).toEqual({ message: "Imagen eliminada con éxito" });
    });

    it("debería manejar errores al eliminar la imagen", async () => {
      const mockPetId = "pet-1";
      const mockImageUrl =
        "https://res.cloudinary.com/dmhnxr6fz/image/upload/v1735422701/nvuqbicspzdik6fpefqt.png";

      global.fetch.mockResolvedValue({ ok: false });

      const result = await PetController.deleteImage(mockPetId, mockImageUrl);

      expect(Pet.deleteImage).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: { error: "Error al eliminar la imagen" },
        status: { status: 500 },
      });
    });
  });
});
