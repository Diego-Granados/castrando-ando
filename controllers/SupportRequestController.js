import SupportRequest from "@/models/SupportRequest";

class SupportRequestController {
  static async createRequest(requestData) {
    try {
      const result = await SupportRequest.createRequest(requestData);
      return { ok: true, id: result.id };
    } catch (error) {
      console.error("Error creating support request:", error);
      return { ok: false, error: error.message };
    }
  }

  static subscribeToRequests(setRequests) {
    try {
      SupportRequest.getRequests(setRequests);
    } catch (error) {
      console.error("Error getting support requests:", error);
      setRequests([]);
    }
  }
}

export default SupportRequestController; 