import Newsletter from "@/models/Newsletter";
import { sendNewsletterEmail } from "@/lib/firebase/Brevo";

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
      // First send the email to all subscribers
      const response = await sendNewsletterEmail(message);
      
      if (!response.ok) {
        throw new Error("Failed to send newsletter");
      }

      // Then update the message status
      const success = await Newsletter.update(message.id, {
        ...message,
        status: 'sent',
        sentAt: new Date().toISOString()
      });

      if (!success) {
        throw new Error("Failed to update message status");
      }

      return true;
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