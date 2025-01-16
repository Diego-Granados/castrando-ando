"use client;";
import ContactRequest from "@/models/ContactRequest";
import {
  sendContactEmail,
  sendReply,
} from "@/controllers/EmailSenderController";
export default class ContactController {
  static async createContactRequest(contactData) {
    try {
      const success = await ContactRequest.create(contactData);
      if (success) {
        const response = await sendContactEmail(
          contactData.message,
          contactData.email,
          contactData.name,
          contactData.type
        );
        if (!response.ok) {
          console.error("Error in createContactRequest:", error);
        }
      }
      return success;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getAllContactRequests() {
    try {
      return await ContactRequest.getAll();
    } catch (error) {
      console.error("Error getting contact requests:", error);
      throw error;
    }
  }

  static async deleteContactRequest(requestId) {
    try {
      return await ContactRequest.delete(requestId);
    } catch (error) {
      console.error("Error deleting contact request:", error);
      throw error;
    }
  }

  static async updateContactRequest(requestId, data) {
    try {
      const { id, ...updateData } = data;
      return await ContactRequest.update(requestId, updateData);
    } catch (error) {
      console.error("Error updating contact request:", error);
      throw error;
    }
  }

  static async replyToContactRequest(requestId, requestData, replyMessage) {
    try {
      // First update the request in Firebase
      const { id, ...updateData } = requestData;
      const success = await ContactRequest.update(requestId, {
        ...updateData,
        reply: replyMessage.trim(),
        read: true,
      });

      if (!success) {
        throw new Error("Failed to update contact request");
      }

      // Then send the email
      const response = await sendReply(
        requestData.message,
        requestData.email,
        requestData.name,
        replyMessage.trim()
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      return true;
    } catch (error) {
      console.error("Error in replyToContactRequest:", error);
      throw error;
    }
  }
}
