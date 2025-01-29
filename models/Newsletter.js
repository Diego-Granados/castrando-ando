"use client";
import { db } from "@/lib/firebase/config";
import { ref, push, update, get, query, orderByChild } from "firebase/database";

export default class Newsletter {
  constructor(data) {
    this.id = data.id;
    this.subject = data.subject;
    this.content = data.content;
    this.status = data.status || 'draft';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.sentAt = data.sentAt || null;
  }

  static async create(messageData) {
    try {
      const newsletterRef = ref(db, "newsletterMessages");
      const newMessageRef = push(newsletterRef);
      const message = {
        subject: messageData.subject,
        content: messageData.content,
        createdAt: new Date().toISOString(),
        status: "draft"
      };
      
      await update(ref(db, `newsletterMessages/${newMessageRef.key}`), message);
      return true;
    } catch (error) {
      console.error("Error creating newsletter message:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const newsletterRef = ref(db, "newsletterMessages");
      const snapshot = await get(newsletterRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const messages = [];
      snapshot.forEach((child) => {
        messages.push({
          id: child.key,
          ...child.val()
        });
      });

      return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error("Error getting newsletter messages:", error);
      throw error;
    }
  }

  static async update(messageId, data) {
    try {
      const { id, ...updateData } = data;
      await update(ref(db, `newsletterMessages/${messageId}`), updateData);
      return true;
    } catch (error) {
      console.error("Error updating newsletter message:", error);
      throw error;
    }
  }

  static async delete(messageId) {
    try {
      const updates = {};
      updates[`/newsletterMessages/${messageId}`] = null;
      await update(ref(db), updates);
      return true;
    } catch (error) {
      console.error("Error deleting newsletter message:", error);
      throw error;
    }
  }

  static async addSubscriber(subscriberData) {
    try {
      const subscribersRef = ref(db, "newsletterSubscribers");
      
      // Check if email already exists
      const snapshot = await get(subscribersRef);
      if (snapshot.exists()) {
        const subscribers = snapshot.val();
        const existingSubscriber = Object.values(subscribers).find(
          s => s.email.toLowerCase() === subscriberData.email.toLowerCase()
        );
        if (existingSubscriber) {
          throw new Error("Email already subscribed");
        }
      }
      
      const newSubscriberRef = push(subscribersRef);
      await update(ref(db, `newsletterSubscribers/${newSubscriberRef.key}`), subscriberData);
      return { ...subscriberData, id: newSubscriberRef.key };
    } catch (error) {
      console.error("Error adding newsletter subscriber:", error);
      throw error;
    }
  }

  static async getAllSubscribers() {
    try {
      const subscribersRef = ref(db, "newsletterSubscribers");
      const snapshot = await get(subscribersRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const subscribers = [];
      snapshot.forEach((child) => {
        subscribers.push({
          id: child.key,
          ...child.val()
        });
      });

      return subscribers.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt));
    } catch (error) {
      console.error("Error getting newsletter subscribers:", error);
      throw error;
    }
  }

  static async updateSubscriber(subscriberId, data) {
    try {
      const { id, ...updateData } = data;
      await update(ref(db, `newsletterSubscribers/${subscriberId}`), updateData);
      return true;
    } catch (error) {
      console.error("Error updating newsletter subscriber:", error);
      throw error;
    }
  }

  static async deleteSubscriber(subscriberId) {
    try {
      const updates = {};
      updates[`/newsletterSubscribers/${subscriberId}`] = null;
      await update(ref(db), updates);
      return true;
    } catch (error) {
      console.error("Error deleting newsletter subscriber:", error);
      throw error;
    }
  }
} 