import SupportRequest from "@/models/SupportRequest";

class AdminSupportRequestController {
  static async getAllRequests(setRequests) {
    try {
      await SupportRequest.getRequests(setRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      return { ok: false, error: error.message };
    }
  }

  static async deleteRequest(requestId) {
    try {
      await SupportRequest.deleteRequest(requestId);
      return { ok: true };
    } catch (error) {
      console.error("Error deleting request:", error);
      return { ok: false, error: error.message };
    }
  }
}

export default AdminSupportRequestController; 