import VolunteerModel from "@/models/Volunteer";

class VolunteerController {
  static async createVolunteer(volunteerData) {
    try {
      return await VolunteerModel.create(volunteerData);
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
