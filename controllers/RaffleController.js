import Raffle from "@/models/Raffle";

class RaffleController {
  static async getAllRaffles() {
    return await Raffle.getAll();
  }

  static async getRaffleById(raffleId) {
    return await Raffle.getById(raffleId);
  }

  static async createOrUpdateRaffle(raffleData) {
    try {
      if (raffleData.id) {
        await Raffle.updateRaffle(raffleData.id, raffleData);
      } else {
        raffleData.id = Date.now().toString();
        await Raffle.createRaffle(raffleData);
      }
    } catch (error) {
      throw new Error(`Error saving raffle: ${error.message}`);
    }
  }

  static async deleteRaffle(raffleId) {
    try {
      return await Raffle.deleteRaffle(raffleId);
    } catch (error) {
      throw new Error(`Error deleting raffle: ${error.message}`);
    }
  }

  static async approvePurchase(raffleId, number) {
    try {
      const raffle = await Raffle.getById(raffleId);
      if (raffle) {
        raffle.numbers[number].purchased = true;
        await Raffle.updateRaffle(raffleId, raffle);
      }
    } catch (error) {
      throw new Error(`Error approving purchase: ${error.message}`);
    }
  }

  static async announceWinner(raffleId, winningNumber) {
    try {
      const raffle = await Raffle.getById(raffleId);
      if (raffle) {
        const winner = raffle.numbers[winningNumber];
        if (winner && winner.purchased) {
          return { winner: true, purchaser: winner.purchaser };
        } else {
          return { winner: false };
        }
      }
    } catch (error) {
      throw new Error(`Error announcing winner: ${error.message}`);
    }
  }
}

export default RaffleController;
