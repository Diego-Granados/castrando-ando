import { ref, get, set, update, remove } from "firebase/database";
import { db } from "@/lib/firebase/config";

class Raffle {
  static async getAll() {
    const rafflesRef = ref(db, "raffles");
    const snapshot = await get(rafflesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("No raffles found");
      return {};
    }
  }

  static async getById(raffleId) {
    const raffleRef = ref(db, `raffles/${raffleId}`);
    const snapshot = await get(raffleRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("No raffle found with the given ID");
      return null;
    }
  }

  static async createRaffle(raffleData) {
    const newRaffleRef = ref(db, `raffles/${raffleData.id}`);
    await set(newRaffleRef, raffleData);
  }

  static async updateRaffle(raffleId, raffleData) {
    const raffleRef = ref(db, `raffles/${raffleId}`);
    await update(raffleRef, raffleData);
  }

  static async deleteRaffle(raffleId) {
    const raffleRef = ref(db, `raffles/${raffleId}`);
    await remove(raffleRef);
  }
}

export default Raffle;
