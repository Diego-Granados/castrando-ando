import Raffle from "@/models/Raffle";
import { ref, set, update } from "firebase/database";
import { db } from "@/lib/firebase/config";

class RaffleController {
  static async getAllRaffles() {
    try {
      const raffles = await Raffle.getAll();
      console.log("Raffles from controller:", raffles); // Debug
      return raffles || {};
    } catch (error) {
      console.error("Error in getAllRaffles:", error);
      return {};
    }
  }

  static async getRaffleById(raffleId) {
    return await Raffle.getById(raffleId);
  }

  static async createRaffle(raffleData) {
    try {
      let imageUrl = "";
      if (raffleData.image) {
        const formData = new FormData();
        formData.append("files", raffleData.image);
        formData.append("path", "raffles");

        const response = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error uploading file: ${response.statusText}`);
        }

        const downloadURLs = await response.json();
        imageUrl = downloadURLs[0];
      }

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

      const newRaffle = {
        name: raffleData.name,
        description: raffleData.description,
        price: raffleData.price,
        date: raffleData.date,
        image: imageUrl,
        status: "active",
        numbers: numbers,
        createdAt: Date.now(),
        winner: "",
        winnerName: "",
      };

      const raffleRef = ref(db, "raffles/" + Date.now());
      await set(raffleRef, newRaffle);

      return newRaffle;
    } catch (error) {
      console.error("Create error:", error);
      throw new Error(`Error creating raffle: ${error.message}`);
    }
  }

  static async updateRaffleData(currentRaffle, raffleData) {
    let imageUrl = currentRaffle.image;

    // Solo procesar la imagen si hay una nueva (es un archivo File)
    if (raffleData.image instanceof File) {
      const formData = new FormData();
      formData.append("files", raffleData.image);
      formData.append("path", "raffles");

      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error uploading file: ${response.statusText}`);
      }

      const downloadURLs = await response.json();
      imageUrl = downloadURLs[0];
    } else if (raffleData.image === null) {
      // Si la imagen es explícitamente null, mantener la imagen existente
      imageUrl = currentRaffle.image;
    }

    // Asegurarse de que numbers tenga la estructura correcta
    const numbers = currentRaffle.numbers || {};
    Object.keys(numbers).forEach((key) => {
      if (!numbers[key].buyer) {
        numbers[key] = {
          buyer: numbers[key].buyer || "",
          id: numbers[key].id || "",
          phone: numbers[key].phone || "",
          receipt: numbers[key].receipt || "",
          status: numbers[key].status || "available",
        };
      }
    });

    // Crear objeto de actualización limpio
    return {
      name: raffleData.name || currentRaffle.name,
      description: raffleData.description || currentRaffle.description,
      price: raffleData.price || currentRaffle.price,
      date: raffleData.date || currentRaffle.date,
      status: raffleData.status || currentRaffle.status,
      image: imageUrl || currentRaffle.image,
      numbers: numbers,
    };
  }

  static async updateRaffle(raffleId, raffleData) {
    try {
      console.log("Starting update with data:", raffleData);

      // Obtener la rifa actual
      const currentRaffle = await this.getRaffleById(raffleId);
      if (!currentRaffle) {
        throw new Error("Raffle not found");
      }

      // Actualizar los datos usando la nueva función
      const cleanUpdateData = await this.updateRaffleData(
        currentRaffle,
        raffleData
      );
      console.log("Clean update data:", cleanUpdateData);

      // Actualizar en Firebase
      const raffleRef = ref(db, `raffles/${raffleId}`);
      await set(raffleRef, cleanUpdateData);

      console.log("Update successful");
      return cleanUpdateData;
    } catch (error) {
      console.error("Update error:", error);
      throw new Error(`Error updating raffle: ${error.message}`);
    }
  }

  static async approvePurchase(raffleId, number) {
    try {
      await Raffle.updateNumber(raffleId, number, {
        purchased: true,
        approved: true,
      });
    } catch (error) {
      throw new Error(`Error approving purchase: ${error.message}`);
    }
  }

  static async deletePurchase(raffleId, number) {
    try {
      const raffle = await Raffle.getById(raffleId);
      const numberData = raffle.numbers[number];

      if (numberData?.image) {
        await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: [numberData.image] }),
        });
      }

      await Raffle.updateNumber(raffleId, number, {
        purchased: false,
        purchaser: null,
        image: null,
        approved: false,
      });
    } catch (error) {
      throw new Error(`Error deleting purchase: ${error.message}`);
    }
  }

  static async announceWinner(raffleId, winningNumber) {
    try {
      const raffle = await Raffle.getById(raffleId);
      const winningData = raffle.numbers[winningNumber];

      if (!winningData?.purchased) {
        return { winner: false };
      }

      // Update the raffle with winner information
      const raffleRef = ref(db, `raffles/${raffleId}`);
      await update(raffleRef, {
        status: "finished",
        winner: winningNumber,
        winnerName: winningData.buyer,
      });

      return {
        winner: true,
        purchaser: winningData.buyer,
      };
    } catch (error) {
      throw new Error(`Error announcing winner: ${error.message}`);
    }
  }

  static async reserveNumber(raffleId, number, formData) {
    try {
      // Upload comprobante image if provided
      let imageUrl = null;
      if (formData.proof) {
        const formDataToSend = new FormData();
        formDataToSend.append("files", formData.proof);
        formDataToSend.append("path", "raffles/comprobantes");

        const response = await fetch("/api/storage/upload", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(
            `Error uploading comprobante: ${response.statusText}`
          );
        }

        const downloadURLs = await response.json();
        imageUrl = downloadURLs[0];
      }

      // Update number data
      const numberData = {
        number: parseInt(number),
        purchased: true,
        purchaser: formData.name,
        cedula: formData.cedula,
        phone: formData.phone,
        image: imageUrl,
        approved: false,
      };

      await Raffle.updateNumber(raffleId, number, numberData);
      return numberData;
    } catch (error) {
      console.error("Error in reserveNumber:", error);
      throw new Error(`Error reserving number: ${error.message}`);
    }
  }

  static async deleteRaffle(raffleId) {
    try {
      // Obtener la rifa antes de eliminarla para tener acceso a las imágenes
      const raffle = await Raffle.getById(raffleId);

      if (!raffle) {
        throw new Error("Rifa no encontrada");
      }

      // Eliminar la imagen principal de la rifa si existe
      if (raffle.image) {
        await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: [raffle.image] }),
        });
      }

      // Recopilar todas las imágenes de comprobantes
      const comprobantes = Object.values(raffle.numbers || {})
        .filter((number) => number.image)
        .map((number) => number.image);

      // Eliminar las imágenes de comprobantes si existen
      if (comprobantes.length > 0) {
        await fetch("/api/storage/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: comprobantes }),
        });
      }

      // Eliminar la rifa de la base de datos
      await Raffle.deleteRaffle(raffleId);

      console.log("Rifa eliminada exitosamente:", raffleId);
      return true;
    } catch (error) {
      console.error("Error en deleteRaffle:", error);
      throw new Error(`Error al eliminar la rifa: ${error.message}`);
    }
  }

  static async updateNumber(raffleId, number, numberData) {
    try {
      console.log("Updating number with data:", {
        raffleId,
        number,
        numberData,
      });

      // Obtener la rifa actual primero
      const currentRaffle = await this.getRaffleById(raffleId);
      if (!currentRaffle) {
        throw new Error("Raffle not found");
      }

      // Preparar los datos de actualización
      const updateData = {
        ...currentRaffle.numbers[number], // Mantener datos existentes
        number: parseInt(number),
        buyer: numberData.buyer || "",
        id: numberData.id || "",
        phone: numberData.phone || "",
        status: numberData.status || "available",
        purchased: numberData.purchased || false,
        approved: numberData.approved || false,
      };

      // Si hay un archivo de comprobante, subirlo primero
      if (numberData.receipt instanceof File) {
        const formData = new FormData();
        formData.append("files", numberData.receipt);
        formData.append("path", "receipts");

        const response = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error uploading receipt: ${response.statusText}`);
        }

        const downloadURLs = await response.json();
        updateData.receipt = downloadURLs[0];
      }

      // Actualizar solo el número específico en Firebase
      const numberRef = ref(db, `raffles/${raffleId}/numbers/${number}`);
      await update(numberRef, updateData);

      console.log("Number updated successfully");
      return updateData;
    } catch (error) {
      console.error("Update number error:", error);
      throw new Error(`Error updating number: ${error.message}`);
    }
  }
}

export default RaffleController;
