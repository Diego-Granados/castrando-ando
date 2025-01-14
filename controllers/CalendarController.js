import CalendarCampaign from "@/models/CalendarCampaign";

class CalendarController {
  static async getCampaignsByMonth(month, year) {
    try {
      const campaigns = await CalendarCampaign.getCampaignsByMonth(month, year);
      return { ok: true, campaigns };
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return { ok: false, error: error.message };
    }
  }
}

export default CalendarController; 