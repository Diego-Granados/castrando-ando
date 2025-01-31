import CalendarCampaign from "@/models/CalendarCampaign";

class CalendarController {
  static async getCampaignsByMonth(month, year) {
    try {
      const events = await CalendarCampaign.getEventsByMonth(month, year);
      return { 
        ok: true, 
        campaigns: events.filter(event => event.type === 'campaign'),
        activities: events.filter(event => event.type === 'activity'),
        raffles: events.filter(event => event.type === 'raffle'),
        allEvents: events
      };
    } catch (error) {
      console.error("Error fetching events:", error);
      return {
        ok: false,
        error: error.message
      };
    }
  }
}

export default CalendarController; 