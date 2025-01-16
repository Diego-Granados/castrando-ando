"use client";
import { db } from "@/lib/firebase/config";
import { ref, push, update, get, query, orderByChild } from "firebase/database";

export default class ContactRequest {
  constructor(data) {
    this.id = data.id;
    this.idNumber = data.idNumber;
    this.name = data.name;
    this.email = data.email;
    this.message = data.message;
    this.type = data.type;
    this.date = data.date || new Date().toISOString();
    this.read = data.read || false;

    this.validate();
  }

  validate() {
    if (!this.message) throw new Error("Contact request must have a message");
    if (!this.email) throw new Error("Contact request must have an email");
    if (!this.type) throw new Error("Contact request must have a type");
  }

  toJSON() {
    return {
      id: this.id,
      idNumber: this.idNumber,
      name: this.name,
      email: this.email,
      message: this.message,
      type: this.type,
      date: this.date,
      read: this.read,
    };
  }

  static async create(contactData) {
    try {
      const contactsRef = ref(db, "contactRequests");
      const newContactRef = push(contactsRef);
      const updates = {};
      updates[`/contactRequests/${newContactRef.key}`] = contactData;
      await update(ref(db), updates);
      return true;
    } catch (error) {
      console.error("Error creating contact request:", error);
      return false;
    }
  }

  static async getAll() {
    try {
      const contactsRef = ref(db, "contactRequests");
      const snapshot = await get(contactsRef);

      if (!snapshot.exists()) {
        return [];
      }

      const requests = [];
      snapshot.forEach((child) => {
        requests.push({
          id: child.key,
          ...child.val(),
        });
      });

      // Sort by date descending (newest first)
      return requests.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error("Error getting contact requests:", error);
      throw error;
    }
  }

  static async update(requestId, data) {
    try {
      const updates = {};
      updates[`/contactRequests/${requestId}`] = data;
      await update(ref(db), updates);
      return true;
    } catch (error) {
      console.error("Error updating contact request:", error);
      return false;
    }
  }
}
