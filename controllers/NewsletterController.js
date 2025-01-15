import Newsletter from "@/models/Newsletter";
import { sendNewsletterEmail } from "@/controllers/EmailSenderController";

export default class NewsletterController {
  static async createMessage(messageData) {
    try {
      return await Newsletter.create(messageData);
    } catch (error) {
      console.error("Error creating newsletter message:", error);
      throw error;
    }
  }

  static async getAllMessages() {
    try {
      return await Newsletter.getAll();
    } catch (error) {
      console.error("Error getting newsletter messages:", error);
      throw error;
    }
  }

  static async updateMessage(messageId, data) {
    try {
      return await Newsletter.update(messageId, data);
    } catch (error) {
      console.error("Error updating newsletter message:", error);
      throw error;
    }
  }

  static async deleteMessage(messageId) {
    try {
      return await Newsletter.delete(messageId);
    } catch (error) {
      console.error("Error deleting newsletter message:", error);
      throw error;
    }
  }

  static async sendMessage(message) {
    try {
      // Get all active subscribers
      const subscribers = await Newsletter.getAllSubscribers();
      
      if (subscribers.length === 0) {
        throw new Error("No hay suscriptores para enviar el boletín");
      }

      const failedEmails = [];

      // Send email to each subscriber sequentially
      for (const subscriber of subscribers) {
        try {
          const response = await sendNewsletterEmail(
            message.content,
            subscriber.email,
            message.subject
          );
          
          if (!response.ok) {
            failedEmails.push(subscriber.email);
          }
        } catch (error) {
          console.error(`Error sending to ${subscriber.email}:`, error);
          failedEmails.push(subscriber.email);
          continue; // Continue with next subscriber even if one fails
        }
      }

      // Update message status after sending to all subscribers
      const success = await Newsletter.update(message.id, {
        ...message,
        status: 'sent',
        sentAt: new Date().toISOString(),
        failedRecipients: failedEmails.length > 0 ? failedEmails : null
      });

      if (!success) {
        throw new Error("Failed to update message status");
      }

      // Return detailed result
      return {
        success: true,
        totalSent: subscribers.length - failedEmails.length,
        failedCount: failedEmails.length,
        failedEmails: failedEmails
      };
    } catch (error) {
      console.error("Error sending newsletter:", error);
      throw error;
    }
  }

  static async addSubscriber(subscriberData) {
    try {
      return await Newsletter.addSubscriber(subscriberData);
    } catch (error) {
      console.error("Error adding newsletter subscriber:", error);
      throw error;
    }
  }

  static async getAllSubscribers() {
    try {
      return await Newsletter.getAllSubscribers();
    } catch (error) {
      console.error("Error getting newsletter subscribers:", error);
      throw error;
    }
  }

  static async updateSubscriber(subscriberId, data) {
    try {
      return await Newsletter.updateSubscriber(subscriberId, data);
    } catch (error) {
      console.error("Error updating newsletter subscriber:", error);
      throw error;
    }
  }

  static async deleteSubscriber(subscriberId) {
    try {
      return await Newsletter.deleteSubscriber(subscriberId);
    } catch (error) {
      console.error("Error deleting newsletter subscriber:", error);
      throw error;
    }
  }
}
