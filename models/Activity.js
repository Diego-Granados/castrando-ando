"use client";
import { db } from "@/lib/firebase/config";
import { ref, get, set, child, update, push, onValue } from "firebase/database";

class Activity {
  static async create(activityData) {
    try {
      const activitiesRef = ref(db, "activities");
      const newActivityRef = push(activitiesRef);
      await set(newActivityRef, {
        ...activityData,
        createdAt: new Date().toISOString(),
        enabled: true,
      });
      return { id: newActivityRef.key };
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  }

  static async getById(id, setActivity) {
    const activityRef = ref(db, `activities/${id}`);
    const unsubscribe = onValue(activityRef, (snapshot) => {
      if (!snapshot.exists() || !snapshot.val().enabled) {
        setActivity(null);
        return;
      }
      const activity = snapshot.val();
      setActivity(activity);
    });
    return unsubscribe;
  }

  static async getAll(setActivities) {
    const activitiesRef = ref(db, "activities");
    const unsubscribe = onValue(activitiesRef, (snapshot) => {
      if (!snapshot.exists()) {
        setActivities({});
        return;
      }
      const activities = snapshot.val();
      // Filter out disabled activities
      const filteredActivities = Object.entries(activities)
        .filter(([_, activity]) => activity.enabled)
        .reduce((acc, [id, activity]) => {
          acc[id] = activity;
          return acc;
        }, {});
      setActivities(filteredActivities);
    });
    return unsubscribe;
  }

  static async getAllOnce() {
    try {
      const activitiesRef = ref(db, "activities");
      const snapshot = await get(activitiesRef);
      if (snapshot.exists()) {
        const activities = snapshot.val();
        return Object.entries(activities)
          .filter(([_, activity]) => activity.enabled)
          .reduce((acc, [id, activity]) => {
            acc[id] = activity;
            return acc;
          }, {});
      }
      return {};
    } catch (error) {
      console.error("Error getting activities:", error);
      throw error;
    }
  }

  static async getByIdOnce(id) {
    try {
      const activityRef = ref(db, `activities/${id}`);
      const snapshot = await get(activityRef);
      if (snapshot.exists() && snapshot.val().enabled) {
        return snapshot.val();
      }
      throw new Error("Activity not found");
    } catch (error) {
      console.error("Error getting activity:", error);
      throw error;
    }
  }

  static async update(id, activityData) {
    try {
      const activityRef = ref(db, `activities/${id}`);
      await update(activityRef, {
        ...activityData,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const activityRef = ref(db, `activities/${id}`);
      await update(activityRef, {
        enabled: false,
        deletedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  }
}

export default Activity;
