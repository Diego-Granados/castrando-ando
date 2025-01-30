import Notification from "@/models/Notification";
import AuthController from "@/controllers/AuthController";
import InscriptionController from "@/controllers/InscriptionController";
import Activity from "@/models/Activity";


class NotificationController {
  static async createNotification(data) {
    try {
      const currentUser = await AuthController.getCurrentUser();
      if (!currentUser) throw new Error("No user authenticated");

      // Validate target user exists (skip validation if it's an admin notification)
      if (data.userId !== 'admin') {
        const validUsers = await AuthController.filterRegisteredUsers([data.userId]);
        if (validUsers.length === 0) {
          return;
        }
      }

      const notificationData = {
        ...data,
        date: new Date().toISOString(),
        read: false,
        enabled: true
      };

      console.log(notificationData);
      return await Notification.create(notificationData);
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  static async getNotifications(setNotifications, limit = null) {
    try {
      const currentUser = await AuthController.getCurrentUser();
      if (!currentUser) throw new Error("No user authenticated");
      const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);
      
      return await Notification.getAll(cedula, setNotifications, limit);
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw error;
    }
  }

  static async getUnreadCount(setCount) {
    try {
        const currentUser = await AuthController.getCurrentUser();
        if (!currentUser) throw new Error("No user authenticated");
        const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);

        return await Notification.getUnreadCount(cedula, setCount);
    } catch (error) {
        console.error("Error getting unread count:", error);
        throw error;
    }
  }

  static async markAsRead(notificationId) {
    try {
        const currentUser = await AuthController.getCurrentUser();
        if (!currentUser) throw new Error("No user authenticated");
        const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);

        await Notification.markAsRead(notificationId, cedula);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
  }

  static async markAllAsRead() {
    try {
        const currentUser = await AuthController.getCurrentUser();
        if (!currentUser) throw new Error("No user authenticated");
        const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);

        await Notification.markAllAsRead(cedula);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  static async deleteNotification(notificationId) {
    try {
        const currentUser = await AuthController.getCurrentUser();
        if (!currentUser) throw new Error("No user authenticated");
        const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);

        await Notification.delete(notificationId, cedula);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  static async sendBulkNotifications(userIds, notificationData) {
    try {
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new Error("userIds must be a non-empty array");
      }

      if (!notificationData.title || !notificationData.message) {
        throw new Error("Notification must have a title and message");
      }

      const baseNotification = {
        ...notificationData,
        date: new Date().toISOString(),
        read: false,
        enabled: true
      };

      const notifications = userIds.map(userId => ({
        ...baseNotification,
        userId
      }));

      const results = await Notification.createBulkNotifications(notifications);

      const summary = {
        total: userIds.length,
        successful: 0,
        failed: 0,
        errors: []
      };

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          summary.successful++;
        } else {
          summary.failed++;
          summary.errors.push({
            userId: userIds[index],
            error: result.reason.message
          });
        }
      });

      return summary;
    } catch (error) {
      console.error("Error sending bulk notifications:", error);
      throw error;
    }
  }

  static async sendNotificationToAllUsers(notificationData) {
    try {
      const userIds = await Notification.getAllUsers();
      if (userIds.length === 0) {
        throw new Error("No users found");
      }
      return await this.sendBulkNotifications(userIds, notificationData);
    } catch (error) {
      console.error("Error sending notification to all users:", error);
      throw error;
    }
  }


  static async sendCampaignNotification(notificationData) {
    try {
      const participants = await InscriptionController.getCampaignParticipants(notificationData.campaignId);
      if (participants.length === 0) {
        return { ok: true, message: "No hay participantes registrados en esta campaña" };
      }
      console.log("Participants:", participants);
      const validParticipants = await AuthController.filterRegisteredUsers(participants);
      console.log("Valid participants:", validParticipants);
      if (validParticipants.length === 0) {
        return { ok: true, message: "No hay participantes válidos registrados en esta campaña" };
      }

      console.log("Sending notifications to verified participants:", validParticipants);
      return await this.sendBulkNotifications(validParticipants, notificationData);
    } catch (error) {
      console.error("Error sending campaign notifications:", error);
      throw error;
    }
  }

  static async createAdminNotification(data) {
    try {
      const notificationData = {
        ...data,
        date: new Date().toISOString(),
        read: false,
        enabled: true,
        userId: 'admin'
      };

      return await Notification.create(notificationData, 'admin');
    } catch (error) {
      console.error("Error creating admin notification:", error);
      throw error;
    }
  }

  static async getAdminNotifications(setNotifications, limit = null) {
    try {
      return await Notification.getAll('admin', setNotifications, limit);
    } catch (error) {
      console.error("Error getting admin notifications:", error);
      throw error;
    }
  }

  static async getAdminUnreadCount(setCount) {
    try {
      return await Notification.getUnreadCount('admin', setCount);
    } catch (error) {
      console.error("Error getting admin unread count:", error);
      throw error;
    }
  }

  static async markAdminNotificationAsRead(notificationId) {
    try {
      await Notification.markAsRead(notificationId, 'admin');
    } catch (error) {
      console.error("Error marking admin notification as read:", error);
      throw error;
    }
  }

  static async markAllAdminNotificationsAsRead() {
    try {
      await Notification.markAllAsRead('admin');
    } catch (error) {
      console.error("Error marking all admin notifications as read:", error);
      throw error;
    }
  }

  static async deleteAdminNotification(notificationId) {
    try {
      await Notification.delete(notificationId, 'admin');
    } catch (error) {
      console.error("Error deleting admin notification:", error);
      throw error;
    }
  }

  static async sendNotificationToActivityParticipants(notificationData) {
    try {
      // Get the activity first
      const activity = await Activity.getByIdOnce(notificationData.activityId);
      
      if (!activity || !activity.registeredUsers) {
        return { ok: true, message: "No participants to notify" };
      }

      // Get array of user IDs from registeredUsers object
      const participants = Object.keys(activity.registeredUsers);
      
      if (participants.length === 0) {
        return { ok: true, message: "No participants to notify" };
      }

      console.log("Sending notifications to participants:", participants);

      return await this.sendBulkNotifications(participants, notificationData);
    } catch (error) {
      console.error("Error sending activity notifications:", error);
      throw error;
    }
  }
}

export default NotificationController;
