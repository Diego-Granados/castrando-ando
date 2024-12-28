"use client";
import Pet from "@/models/Pet";
import AuthController from "@/controllers/AuthController";
export default class PetController {
    static async getPets(setPets, ownerId = null) {
        if (!ownerId) {
            ownerId = await AuthController.getUserId();
        }
        const unsubscribe = await Pet.getPetsByOwner(ownerId, setPets);
        return unsubscribe;
    }

    static async getPetsOnce(ownerId = null) {
        if (!ownerId) {
            ownerId = await AuthController.getUserId();
        }
        const pets = await Pet.getPetsByOwnerOnce(ownerId);
        return pets;
    }

    static async create(pet) {
        const ownerId = await AuthController.getUserId();
        await Pet.create(pet, ownerId);
    }

    static async update(petId, updates, oldImageUrl = null) {
        const ownerId = await AuthController.getUserId();
        await Pet.update(petId, ownerId, updates);
        if (oldImageUrl) {
            await fetch("/api/storage/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ urls: [oldImageUrl] }),
            });
        }
    }

    static async delete(petId, imageUrl) {
        const ownerId = await AuthController.getUserId();
        await Pet.delete(petId, ownerId);
        fetch("/api/storage/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ urls: [imageUrl] }),
        });
    }
}