"use client";
import { db } from "@/lib/firebase/config";
import {
  ref,
  get,
  child,
  set,
  update,
  onValue,
  push,
  increment,
} from "firebase/database";

class Pet {
    static filterEnabled(pets) {
        const filteredPets = {};
        Object.entries(pets).forEach(([key, pet]) => {
            if (pet.enabled) {
                filteredPets[key] = pet;
            }
        });
        return filteredPets;
    }
    
    static async create(pet, ownerId) {
        const petRef = ref(db, `pets/${ownerId}`);
        const newPetRef = push(petRef);
        pet.enabled = true;
        await set(newPetRef, pet)         
    }

    static async getPetsByOwner(ownerId, setPets) {
        const petsRef = ref(db, `pets/${ownerId}`);
        const unsubscribe = onValue(petsRef, (snapshot) => {
            if (snapshot.exists()) {
                const pets = snapshot.val();
                console.log(Pet.filterEnabled(pets));
                setPets(Pet.filterEnabled(pets));
            }
        })
        return unsubscribe;
    }

    static async getPetsByOwnerOnce(ownerId) {
        const petsRef = ref(db, `pets/${ownerId}`);
        const snapshot = await get(petsRef);
        if (snapshot.exists()) {
            return Pet.filterEnabled(snapshot.val());
        } else {
            return {};
        }
    }

    static async update(petId, ownerId, updates) {
        const petRef = ref(db, `pets/${ownerId}/${petId}`);
        updates["enabled"] = true;
        await set(petRef, updates);
    }

    static async delete(petId, ownerId) {
        const updates = {};
        updates[`pets/${ownerId}/${petId}/enabled`] = false;
        await update(ref(db), updates)
    }
}

export default Pet;