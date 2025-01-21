import { ref, get, set, update, remove } from "firebase/database";
import { db } from "@/lib/firebase/config";

class Raffle {
  static async getAll() {
    try {
      const rafflesRef = ref(db, "raffles");
      const snapshot = await get(rafflesRef);
      console.log("Raw snapshot:", snapshot.val()); // Debug
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error("Error getting all raffles:", error);
      return {};
    }
  }

  static async getById(raffleId) {
    try {
      const raffleRef = ref(db, `raffles/${raffleId}`);
      const snapshot = await get(raffleRef);
      return snapshot.val();
    } catch (error) {
      console.error("Error getting raffle:", error);
      throw error;
    }
  }

  static async create(raffleData) {
    try {
      // Inicializar los números (0-99)
      const numbers = {};
      for (let i = 0; i < 100; i++) {
        numbers[i] = {
          number: i, // número de la rifa
          buyer: "", // comprador
          id: "", // cédula
          phone: "", // teléfono
          receipt: "", // comprobante
          status: "available", // estado (available, pending, approved)
          purchased: false, // comprado
          approved: false, // aprobado
        };
      }

      // Agregar los números al objeto de la rifa
      const raffleWithNumbers = {
        ...raffleData,
        numbers,
        createdAt: Date.now(),
      };

      const newRaffleRef = ref(db, "raffles/" + Date.now());
      await set(newRaffleRef, raffleWithNumbers);
      return { id: newRaffleRef.key, ...raffleWithNumbers };
    } catch (error) {
      console.error("Error creating raffle:", error);
      throw error;
    }
  }

  static async updateRaffle(raffleId, data) {
    try {
      const raffleRef = ref(db, `raffles/${raffleId}`);
      await update(raffleRef, data);
      return true;
    } catch (error) {
      console.error("Error updating raffle:", error);
      throw error;
    }
  }

  static async deleteRaffle(raffleId) {
    try {
      const raffleRef = ref(db, `raffles/${raffleId}`);
      await remove(raffleRef);
      return true;
    } catch (error) {
      console.error("Error deleting raffle:", error);
      throw error;
    }
  }

  static async updateNumber(raffleId, number, numberData) {
    try {
      const numberRef = ref(db, `raffles/${raffleId}/numbers/${number}`);
      const updateData = {
        number: parseInt(number),
        buyer: numberData.buyer || "",
        id: numberData.id || "",
        phone: numberData.phone || "",
        receipt: numberData.receipt || "",
        status: numberData.status || "available",
        purchased: numberData.purchased || false,
        approved: numberData.approved || false,
      };

      await update(numberRef, updateData);
      return true;
    } catch (error) {
      console.error("Error updating number:", error);
      throw error;
    }
  }
}

export default Raffle;
