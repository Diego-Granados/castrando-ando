"use client";
import { db } from "@/lib/firebase/config";
import {
  ref,
  get,
  update,
  onValue,
  push,
  remove
} from "firebase/database";

class Adoption {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.edad = data.edad;
    this.tipoAnimal = data.tipoAnimal;
    this.peso = data.peso;
    this.descripcion = data.descripcion;
    this.contact = data.contact;
    this.location = data.location;
    this.estado = data.estado;
    this.photos = data.photos || [];
    this.userId = data.userId;
    this.userEmail = data.userEmail;
    this.userName = data.userName || data.userEmail;
    this.createdAt = data.createdAt;
    this.enabled = data.enabled !== false;

    this.validate();
  }

  validate() {
    if (!this.nombre) throw new Error("Adoption must have a pet name");
    if (!this.tipoAnimal) throw new Error("Adoption must have a species");
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      edad: this.edad,
      tipoAnimal: this.tipoAnimal,
      peso: this.peso,
      descripcion: this.descripcion,
      contact: this.contact,
      location: this.location,
      estado: this.estado,
      photos: this.photos,
      userId: this.userId,
      userEmail: this.userEmail,
      userName: this.userName,
      createdAt: this.createdAt,
      enabled: this.enabled
    };
  }

  static filterEnabled(adoptions) {
    if (!adoptions) return {};
    
    const filtered = {};
    Object.keys(adoptions).forEach((key) => {
      if (adoptions[key].enabled !== false) {
        adoptions[key].id = key;
        filtered[key] = new Adoption(adoptions[key]);
      }
    });
    return filtered;
  }

  static async getAll(setAdoptions) {
    const adoptionsRef = ref(db, "adoptions");
    const unsubscribe = onValue(adoptionsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setAdoptions({});
        return;
      }
      const adoptions = snapshot.val();
      const filteredAdoptions = Adoption.filterEnabled(adoptions);
      setAdoptions(filteredAdoptions);
    });
    return () => unsubscribe();
  }

  static async getById(adoptionId, setAdoption) {
    const adoptionRef = ref(db, `adoptions/${adoptionId}`);
    const unsubscribe = onValue(adoptionRef, (snapshot) => {
      if (!snapshot.exists()) {
        setAdoption(null);
        return;
      }
      const data = snapshot.val();
      data.id = adoptionId;
      setAdoption(new Adoption(data));
    });
    return () => unsubscribe();
  }

  static async getByIdOnce(adoptionId) {
    const adoptionRef = ref(db, `adoptions/${adoptionId}`);
    const snapshot = await get(adoptionRef);
    if (!snapshot.exists()) {
      return null;
    }
    const data = snapshot.val();
    data.id = adoptionId;
    return new Adoption(data);
  }

  static async create(formData) {
    try {
      const adoptionRef = ref(db, "adoptions");
      const newAdoptionRef = push(adoptionRef);
      
      const updates = {};
      updates[`/adoptions/${newAdoptionRef.key}`] = formData;
      
      await update(ref(db), updates);
    } catch (error) {
      console.error("Error creating adoption:", error);
      throw new Error("Failed to create adoption");
    }
  }

  static async update(adoptionId, updates) {
    try {
      // First check if adoption exists
      const snapshot = await get(ref(db, `adoptions/${adoptionId}`));
      if (!snapshot.exists()) {
        return NextResponse.error("No data available");
      }
      await update(ref(db), updates);
    } catch (error) {
      console.error("Error updating adoption:", error);
      throw new Error("Failed to update adoption");
    }
  }

  static async delete(adoptionId) {
    const updates = {};
    updates[`/adoptions/${adoptionId}/enabled`] = false;
    await update(ref(db), updates);
  }
}

export default Adoption; 