import { db } from "@/lib/firebase/config";
import { ref, set, get, update, remove } from "firebase/database";
import NotificationController from "@/controllers/NotificationController";

class VolunteerController {
  static async createVolunteer(volunteerData) {
    try {
      const { id, ...data } = volunteerData;
      const volunteerRef = ref(db, `volunteers/${id}`);
      const snapshot = await get(volunteerRef);
      if (snapshot.exists()) {
        throw new Error(
          "Ya existe una solicitud con este número de cédula, puedes consultarlo más abajo."
        );
      }
      const volunteerWithStatus = { ...data, status: "sent" };
      await set(volunteerRef, volunteerWithStatus);

      // Send notification to admin about new volunteer
      await NotificationController.createAdminNotification({
        title: "Nueva Solicitud de Voluntariado",
        message: `${data.name} ha enviado una solicitud para ser voluntario. Cédula: ${id}`,
        type: "volunteer_application",
        link: `/admin/volunteers`,
        volunteerId: id
      });

      return { id, ...volunteerWithStatus };
    } catch (error) {
      console.error("Error creating volunteer:", error);
      throw error;
    }
  }

  static async getVolunteerById(id) {
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
      console.error("Error getting volunteer:", error);
      throw error;
    }
  }

  static async getVolunteers(setVolunteers) {
    try {
      const volunteersRef = ref(db, "volunteers");
      const snapshot = await get(volunteersRef);
      if (snapshot.exists()) {
        const volunteers = [];
        snapshot.forEach((childSnapshot) => {
          volunteers.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setVolunteers(volunteers);
      } else {
        setVolunteers([]);
      }
    } catch (error) {
      console.error("Error getting volunteers:", error);
      throw error;
    }
  }

  static async updateVolunteer(volunteerId, volunteerData) {
    try {
      const volunteerRef = ref(db, `volunteers/${volunteerId}`);
      await update(volunteerRef, volunteerData);
      return { id: volunteerId, ...volunteerData };
    } catch (error) {
      console.error("Error updating volunteer:", error);
      throw error;
    }
  }

  static async deleteVolunteer(volunteerId) {
    try {
      const volunteerRef = ref(db, `volunteers/${volunteerId}`);
      await remove(volunteerRef);
      return true;
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      throw error;
    }
  }
}

export default VolunteerController;
