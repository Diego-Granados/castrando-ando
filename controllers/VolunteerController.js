import VolunteerModel from "@/models/Volunteer";
import NotificationController from "@/controllers/NotificationController";

class VolunteerController {
  static async createVolunteer(volunteerData) {
    try {
      const result = await VolunteerModel.create(volunteerData);
      
      await NotificationController.createAdminNotification({
        title: "Nueva Solicitud de Voluntariado",
        message: `${volunteerData.name} (${volunteerData.id}) ha enviado una solicitud para ser voluntario.`,
        type: "volunteer_application",
        link: `/admin/volunteers`,
        userId: "admin",
      });

      return { 
        success: true, 
        message: "Solicitud enviada exitosamente. Los administradores han sido notificados." 
      };
    } catch (error) {
      console.error("Error creating volunteer:", error);
      throw error;
    }
  }

  static async getVolunteerById(id) {
    try {
      return await VolunteerModel.getById(id);
    } catch (error) {
      console.error("Error getting volunteer:", error);
      throw error;
    }
  }

  static async getVolunteers(setVolunteers) {
    try {
      const volunteers = await VolunteerModel.getAll();
      setVolunteers(volunteers);
    } catch (error) {
      console.error("Error getting volunteers:", error);
      throw error;
    }
  }

  static async updateVolunteer(volunteerId, volunteerData) {
    try {
      return await VolunteerModel.update(volunteerId, volunteerData);
    } catch (error) {
      console.error("Error updating volunteer:", error);
      throw error;
    }
  }

  static async deleteVolunteer(volunteerId) {
    try {
      return await VolunteerModel.delete(volunteerId);
    } catch (error) {
      console.error("Error deleting volunteer:", error);
      throw error;
    }
  }
}

export default VolunteerController;
