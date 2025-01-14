import { db } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";

class CalendarCampaign {
  static async getCampaignsByMonth(month, year) {
    try {
      const campaignsRef = ref(db, "campaigns");
      const snapshot = await get(campaignsRef);
      
      if (snapshot.exists()) {
        const campaigns = [];
        snapshot.forEach((childSnapshot) => {
          const campaign = childSnapshot.val();
          const campaignDate = new Date(campaign.date);
          
          // Filtra las campañas del mes y año especificados
          if (campaignDate.getMonth() === month && campaignDate.getFullYear() === year) {
            campaigns.push({
              id: childSnapshot.key,
              ...campaign,
              date: campaignDate
            });
          }
        });
        return campaigns;
      }
      return [];
    } catch (error) {
      console.error("Error getting campaigns:", error);
      throw error;
    }
  }
}

export default CalendarCampaign; 