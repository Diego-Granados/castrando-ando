import ContactRequest from "@/models/ContactRequest";

export default class ContactController {
  static async createContactRequest(contactData) {
    try {
      return await ContactRequest.create(contactData);
    } catch (error) {
      console.error("Error in createContactRequest:", error);
      throw error;
    }
  }
} 