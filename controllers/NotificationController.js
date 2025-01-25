import Notification from "@/models/Notification";
import AuthController from "@/controllers/AuthController";


class NotificationController {
  static async createNotification(data) {
    try {
      const currentUser = await AuthController.getCurrentUser();
      if (!currentUser) throw new Error("No user authenticated");

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
      const cedula = await Notification.getCedulaByUserId(currentUser.user.uid);
      
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
        const cedula = await Notification.getCedulaByUserId(currentUser.user.uid);

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
        const cedula = await Notification.getCedulaByUserId(currentUser.user.uid);

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
        const cedula = await Notification.getCedulaByUserId(currentUser.user.uid);

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
        const cedula = await Notification.getCedulaByUserId(currentUser.user.uid);

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

  static async sendNotificationToAdmins(notificationData) {
    try {
      const adminIds = await Notification.getAdminUsers();
      if (adminIds.length === 0) {
        throw new Error("No admin users found");
      }
      return await this.sendBulkNotifications(adminIds, notificationData);
    } catch (error) {
      console.error("Error sending notification to admins:", error);
      throw error;
    }
  }
}

export default NotificationController;
