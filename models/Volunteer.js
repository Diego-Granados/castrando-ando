import { db } from "@/lib/firebase/config";
import { ref, set, get, update, remove } from "firebase/database";

class VolunteerModel {
  static async create(volunteerData) {
    try {
      const { id, ...data } = volunteerData;
      const volunteerRef = ref(db, `volunteers/${id}`);
      const snapshot = await get(volunteerRef);

      if (snapshot.exists()) {
        throw new Error(
          "Ya existe una solicitud con este número de cédula, puedes consultarlo más abajo."
        );
      }

      const volunteerWithStatus = { ...data, status: "pending" };
      await set(volunteerRef, volunteerWithStatus);
      return { id, ...volunteerWithStatus };
    } catch (error) {
      console.error("Error in volunteer model - create:", error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const volunteerRef = ref(db, `volunteers/${id}`);
      const snapshot = await get(volunteerRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        throw new Error(
          "No se ha encontrado ninguna solicitud con esta cédula."
        );
      }
    } catch (error) {
      console.error("Error in volunteer model - getById:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const volunteersRef = ref(db, "volunteers");
      const snapshot = await get(volunteersRef);

      if (snapshot.exists()) {
        const volunteers = [];
        snapshot.forEach((childSnapshot) => {
          volunteers.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return volunteers;
      }
      return [];
    } catch (error) {
      console.error("Error in volunteer model - getAll:", error);
      throw error;
    }
  }

  static async update(volunteerId, volunteerData) {
    try {
      const volunteerRef = ref(db, `volunteers/${volunteerId}`);
      await update(volunteerRef, volunteerData);
      return { id: volunteerId, ...volunteerData };
    } catch (error) {
      console.error("Error in volunteer model - update:", error);
      throw error;
    }
  }

  static async delete(volunteerId) {
    try {
      const volunteerRef = ref(db, `volunteers/${volunteerId}`);
      await remove(volunteerRef);
      return true;
    } catch (error) {
      console.error("Error in volunteer model - delete:", error);
      throw error;
    }
  }
}

export default VolunteerModel;
