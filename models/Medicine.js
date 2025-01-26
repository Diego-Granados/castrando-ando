"use client";
import { db } from "@/lib/firebase/config";
import { ref, get, push, update, remove, onValue } from "firebase/database";

export default class Medicine {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.amount = data.amount;
    this.unit = data.unit;
    this.weightMultiplier = data.weightMultiplier;
    this.daysOfTreatment = data.daysOfTreatment;

    this.validate();
  }

  validate() {
    if (!this.name) throw new Error("Medicine must have a name");
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      unit: this.unit,
      weightMultiplier: this.weightMultiplier,
      daysOfTreatment: this.daysOfTreatment,
    };
  }

  static async getAll(setMedicines) {
    const medicinesRef = ref(db, "medicines");
    const unsubscribe = onValue(medicinesRef, (snapshot) => {
      if (!snapshot.exists()) {
        setMedicines([]);
        return;
      }
      const medicines = snapshot.val();
      const medicinesList = Object.keys(medicines).map(key => 
        new Medicine({ id: key, ...medicines[key] })
      );
      setMedicines(medicinesList);
    });
    return unsubscribe;
  }

  static async create(medicineData) {
    try {
      // Check if medicine with same name exists
      const medicinesRef = ref(db, "medicines");
      const snapshot = await get(medicinesRef);
      
      if (snapshot.exists()) {
        const medicines = snapshot.val();
        const existingMedicine = Object.values(medicines).find(
          m => m.name.toLowerCase() === medicineData.name.toLowerCase()
        );
        
        if (existingMedicine) {
          throw new Error("Ya existe un medicamento con este nombre");
        }
      }

      const newMedicineRef = push(medicinesRef);
      const updates = {};
      updates[`/medicines/${newMedicineRef.key}`] = medicineData;
      await update(ref(db), updates);
      return new Medicine({ id: newMedicineRef.key, ...medicineData });
    } catch (error) {
      console.error("Error creating medicine:", error);
      throw error;
    }
  }

  static async update(id, medicineData) {
    try {
      // Check if another medicine with same name exists (excluding current one)
      const medicinesRef = ref(db, "medicines");
      const snapshot = await get(medicinesRef);
      
      if (snapshot.exists()) {
        const medicines = snapshot.val();
        const existingMedicine = Object.values(medicines).find(
          m => m.name.toLowerCase() === medicineData.name.toLowerCase() && 
          Object.keys(medicines).find(key => medicines[key] === m) !== id
        );
        
        if (existingMedicine) {
          throw new Error("Ya existe otro medicamento con este nombre");
        }
      }

      const updates = {};
      updates[`/medicines/${id}`] = medicineData;
      await update(ref(db), updates);
      return new Medicine({ id, ...medicineData });
    } catch (error) {
      console.error("Error updating medicine:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await remove(ref(db, `medicines/${id}`));
    } catch (error) {
      console.error("Error deleting medicine:", error);
      throw error;
    }
  }

  calculateAmountForPet(petWeight) {
    return Math.ceil((petWeight / this.weightMultiplier) * this.amount);
  }

  static async getAllOnce() {
    try {
      const medicinesRef = ref(db, "medicines");
      const snapshot = await get(medicinesRef);
      if (!snapshot.exists()) {
        return [];
      }
      const medicines = snapshot.val();
      return Object.keys(medicines).map(key => 
        new Medicine({ id: key, ...medicines[key] })
      );
    } catch (error) {
      console.error("Error getting medicines:", error);
      throw error;
    }
  }
} 