import Medicine from "@/models/Medicine";

export default class MedicineController {
  static getAllMedicines(setMedicines) {
    try {
      return Medicine.getAll(setMedicines);
    } catch (error) {
      console.error("Error in getAllMedicines:", error);
      throw error;
    }
  }

  static async createMedicine(medicineData) {
    try {
      return await Medicine.create(medicineData);
    } catch (error) {
      console.error("Error in createMedicine:", error);
      throw error;
    }
  }

  static async updateMedicine(id, medicineData) {
    try {
      return await Medicine.update(id, medicineData);
    } catch (error) {
      console.error("Error in updateMedicine:", error);
      throw error;
    }
  }

  static async deleteMedicine(id) {
    try {
      await Medicine.delete(id);
    } catch (error) {
      console.error("Error in deleteMedicine:", error);
      throw error;
    }
  }
} 