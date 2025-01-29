import { db } from "@/lib/firebase/config";
import { ref, get } from "firebase/database";

class CalendarCampaign {
  static async getEventsByMonth(month, year) {
    try {
      let allEvents = [];

      // Obtener campañas
      const campaignsRef = ref(db, "campaigns");
      const campaignsSnapshot = await get(campaignsRef);
      
      if (campaignsSnapshot.exists()) {
        campaignsSnapshot.forEach((childSnapshot) => {
          const campaign = childSnapshot.val();
          if (campaign.enabled) {  // Solo incluir campañas activas
            const eventDate = new Date(campaign.date);
            if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
              const eventData = {
                id: childSnapshot.key,
                title: campaign.title || campaign.name,
                date: eventDate,
                type: 'campaign',
                color: '#4CAF50'
              };
              allEvents.push(eventData);
            }
          }
        });
      }

      // Obtener actividades
      const activitiesRef = ref(db, "activities");
      const activitiesSnapshot = await get(activitiesRef);
      
      if (activitiesSnapshot.exists()) {
        activitiesSnapshot.forEach((childSnapshot) => {
          const activity = childSnapshot.val();
          if (activity.enabled) {  // Solo incluir actividades activas
            const eventDate = new Date(activity.date);
            if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
              const eventData = {
                id: childSnapshot.key,
                title: activity.title || activity.name,
                date: eventDate,
                type: 'activity',
                color: '#2196F3'
              };
              allEvents.push(eventData);
            }
          }
        });
      }

      // Obtener rifas
      const rafflesRef = ref(db, "raffles");  // Cambiado a "raffles"
      const rafflesSnapshot = await get(rafflesRef);
      
      if (rafflesSnapshot.exists()) {
        rafflesSnapshot.forEach((childSnapshot) => {
          const raffle = childSnapshot.val();
          // Verificar si la rifa está activa (status === 'active')
          if (raffle.status === 'active') {
            const eventDate = new Date(raffle.date);
            if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
              const eventData = {
                id: childSnapshot.key,
                title: raffle.name,  // Usando name en lugar de title
                date: eventDate,
                type: 'raffle',
                color: '#E91E63'
              };
              allEvents.push(eventData);
            }
          }
        });
      }

      console.log('Eventos encontrados:', allEvents); // Debug log

      // Ordenar eventos por fecha
      return allEvents.sort((a, b) => a.date - b.date);
    } catch (error) {
      console.error("Error getting events:", error);
      throw error;
    }
  }
}

export default CalendarCampaign; 