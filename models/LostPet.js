"use client";
import { db } from "@/lib/firebase/config";
import {
  ref,
  get,
  set,
  update,
  remove,
  push,
  query,
  orderByChild,
  onValue,
} from "firebase/database";

class LostPet {
  constructor(data) {
    this.id = data.id;
    this.tipoAnimal = data.tipoAnimal;
    this.status = data.status;
    this.descripcion = data.descripcion;
    this.location = data.location;
    this.contact = data.contact;
    this.photos = data.photos || [];
    this.userId = data.userId;
    this.userEmail = data.userEmail;
    this.userName = data.userName || data.userEmail;
    this.createdAt = data.createdAt;
    this.enabled = data.enabled !== false;
    this.date = data.date || data.createdAt;

    this.validate();
  }

  validate() {
    if (!this.tipoAnimal) throw new Error("Lost pet must have an animal type");
    if (!this.status) throw new Error("Lost pet must have a status");
    if (!this.descripcion) throw new Error("Lost pet must have a description");
  }

  toJSON() {
    return {
      id: this.id,
      tipoAnimal: this.tipoAnimal,
      status: this.status,
      descripcion: this.descripcion,
      location: this.location,
      contact: this.contact,
      photos: this.photos,
      userId: this.userId,
      userEmail: this.userEmail,
      userName: this.userName,
      createdAt: this.createdAt,
      enabled: this.enabled,
      date: this.date
    };
  }

  static filterEnabled(lostPets) {
    if (!lostPets) return {};
    
    const filtered = {};
    Object.keys(lostPets).forEach((key) => {
      if (lostPets[key].enabled !== false) {
        lostPets[key].id = key;
        try {
          filtered[key] = new LostPet(lostPets[key]);
        } catch (error) {
          console.error(`Error creating LostPet instance for key ${key}:`, error);
        }
      }
    });
    return filtered;
  }
  
  static async create(petData) {
    try {
      const lostPetsRef = ref(db, "lostPets");
      const newPetRef = push(lostPetsRef);
      
      const updates = {};
      updates[`/lostPets/${newPetRef.key}`] = petData;
      
      await update(ref(db), updates);
      return newPetRef.key;
    } catch (error) {
      console.error("Error creating lost pet:", error);
      throw new Error("Failed to create lost pet");
    }
  }

  
  static async getAll(setLostPets) {
    const lostPetsRef = ref(db, "lostPets");
    const unsubscribe = onValue(lostPetsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLostPets({});
        return;
      }
      const lostPets = snapshot.val();
      const filteredLostPets = LostPet.filterEnabled(lostPets);
      setLostPets(filteredLostPets);
    });
    return () => unsubscribe();
  }


  static async update(petId, updates) {
    try {
      // First check if pet exists
      const snapshot = await get(ref(db, `lostPets/${petId}`));
      if (!snapshot.exists()) {
        return NextResponse.error("No data available");
      }

      await update(ref(db), updates);
    } catch (error) {
      console.error("Error updating lost pet:", error);
      throw new Error("Failed to update lost pet");
    }
  }

  static async delete(lostPetId) {
    const updates = {};
    updates[`/lostPets/${lostPetId}/enabled`] = false;
    await update(ref(db), updates);
  }

  static async getLostPetById(petId) {
    const petRef = ref(db, `lostPets/${petId}`);
    const snapshot = await get(petRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        id: petId,
        ...data
      };
    }
    return null;
  }

  static async getById(petId, setPet) {
    const petRef = ref(db, `lostPets/${petId}`);
    const unsubscribe = onValue(petRef, (snapshot) => {
      if (!snapshot.exists()) {
        setPet(null);
        return;
      }
      const data = snapshot.val();
      data.id = petId;
      setPet(new LostPet(data));
    });
    return () => unsubscribe();
  }

  static async getByIdOnce(petId) {
    const petRef = ref(db, `lostPets/${petId}`);
    const snapshot = await get(petRef);
    if (!snapshot.exists()) {
      return null;
    }
    const data = snapshot.val();
    data.id = petId;
    return new LostPet(data);
  }
}

export default LostPet; 