import LostPetController from "@/controllers/LostPetController";
import LostPet from "@/models/LostPet";
import AuthController from "@/controllers/AuthController";
import NotificationController from "@/controllers/NotificationController";
import UserActivityController from "@/controllers/UserActivityController";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/models/LostPet");
jest.mock("@/controllers/AuthController");
jest.mock("@/controllers/NotificationController");
jest.mock("@/controllers/UserActivityController");
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => data),
    error: jest.fn((message, options) => ({ error: message, ...options }))
  }
}));

describe("LostPetController", () => {
  let mockFormData;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();

    mockFormData = {
      tipoAnimal: "Perro",
      status: "Perdido",
      descripcion: "Perro pequeño color café",
      location: "San José, Costa Rica",
      contact: "12345678",
      photos: ["photo1.jpg", "photo2.jpg"]
    };
  });

  describe("getAllLostPets", () => {
    it("debería obtener todas las mascotas perdidas", async () => {
      const callback = jest.fn();
      const mockUnsubscribe = jest.fn();
      LostPet.getAll.mockResolvedValue(mockUnsubscribe);

      const result = await LostPetController.getAllLostPets(callback);

      expect(result).toBe(mockUnsubscribe);
      expect(LostPet.getAll).toHaveBeenCalledWith(callback);
    });
  });

  describe("createLostPet", () => {
    it("debería crear una mascota perdida exitosamente", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: {
          uid: "user-1",
          email: "test@example.com",
          displayName: "Test User"
        },
        role: "User"
      });
      LostPet.create.mockResolvedValue("lost-pet-1");
      NotificationController.sendNotificationToAllUsers.mockResolvedValue();
      UserActivityController.registerActivity.mockResolvedValue();

      const result = await LostPetController.createLostPet(mockFormData);

      expect(result).toEqual({
        success: true,
        message: "Publicación creada exitosamente"
      });
      expect(LostPet.create).toHaveBeenCalledWith(expect.objectContaining({
        tipoAnimal: mockFormData.tipoAnimal,
        userId: "user-1",
        enabled: true
      }));
      expect(NotificationController.sendNotificationToAllUsers).toHaveBeenCalled();
      expect(UserActivityController.registerActivity).toHaveBeenCalled();
    });

    it("debería manejar error de autenticación", async () => {
      AuthController.getCurrentUser.mockRejectedValue(new Error("User not authenticated"));

      const result = await LostPetController.createLostPet(mockFormData);

      expect(result).toEqual(expect.objectContaining({
        error: "User not authenticated",
        status: 401
      }));
    });
  });

  describe("updateLostPet", () => {
    it("debería actualizar una mascota perdida exitosamente", async () => {
      const petId = "lost-pet-1";
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "user-1" }
      });
      LostPet.getByIdOnce.mockResolvedValue({
        ...mockFormData,
        photos: ["oldphoto.jpg"]
      });
      global.fetch.mockResolvedValueOnce({ ok: true })  // delete old photos
                    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(["newphoto.jpg"]) }); // upload new photos
      LostPet.update.mockResolvedValue();

      const updateFormData = {
        ...mockFormData,
        photos: ["newphoto.jpg"],
        newFiles: [new File([], "newphoto.jpg")]
      };

      const result = await LostPetController.updateLostPet(petId, updateFormData);

      expect(result).toEqual({
        success: true,
        message: "Publicación actualizada exitosamente"
      });
    });
  });

  describe("deleteLostPet", () => {
    it("debería eliminar una mascota perdida exitosamente", async () => {
      const deleteFormData = {
        petId: "lost-pet-1",
        photos: ["photo1.jpg"]
      };

      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "user-1" },
        role: "Admin"
      });
      LostPet.getByIdOnce.mockResolvedValue({
        userId: "user-1",
        ...mockFormData
      });
      LostPet.delete.mockResolvedValue();
      global.fetch.mockResolvedValue({ ok: true });

      const result = await LostPetController.deleteLostPet(deleteFormData);

      expect(result).toEqual({
        message: "Lost pet post deleted successfully!"
      });
      expect(LostPet.delete).toHaveBeenCalledWith("lost-pet-1");
    });

    it("debería rechazar eliminación si el usuario no está autorizado", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "user-2" },
        role: "User"
      });
      LostPet.getByIdOnce.mockResolvedValue({
        userId: "user-1",
        ...mockFormData
      });

      const result = await LostPetController.deleteLostPet({
        petId: "lost-pet-1"
      });

      expect(result).toEqual(expect.objectContaining({
        error: "Unauthorized to delete this lost pet post"
      }));
    });
  });

  describe("updateLostPetStatus", () => {
    it("debería actualizar el estado de una mascota perdida", async () => {
      AuthController.getCurrentUser.mockResolvedValue({
        user: { uid: "user-1" }
      });
      LostPet.update.mockResolvedValue();

      const result = await LostPetController.updateLostPetStatus("lost-pet-1", "Encontrado");

      expect(result).toEqual({
        success: true,
        message: "Estado actualizado exitosamente"
      });
      expect(LostPet.update).toHaveBeenCalledWith("lost-pet-1", {
        "/lostPets/lost-pet-1/status": "Encontrado"
      });
    });
  });
}); 