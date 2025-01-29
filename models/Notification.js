"use client";
import { db } from "@/lib/firebase/config";
import {
    ref,
    get,
    set,
    update,
    push,
    query,
    orderByChild,
    equalTo,
    limitToLast,
    onValue
} from "firebase/database";

class Notification {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.message = data.message;
        this.date = data.date || new Date().toISOString();
        this.read = data.read || false;
        this.link = data.link;
        this.userId = data.userId;
        this.type = data.type; // 'admin' or 'user'
        this.enabled = data.enabled !== false;

        this.validate();
    }

    validate() {
        if (!this.title) throw new Error("Notification must have a title");
        if (!this.message) throw new Error("Notification must have a message");
        if (!this.userId) throw new Error("Notification must have a userId");
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            message: this.message,
            date: this.date,
            read: this.read,
            link: this.link,
            userId: this.userId,
            type: this.type,
            enabled: this.enabled
        };
    }

    static filterEnabled(notifications) {
        if (!notifications) return {};
        
        const filtered = {};
        Object.keys(notifications).forEach((key) => {
            if (notifications[key].enabled !== false) {
                notifications[key].id = key;
                try {
                    filtered[key] = new Notification(notifications[key]);
                } catch (error) {
                    console.error(`Error creating Notification instance for key ${key}:`, error);
                }
            }
        });
        return filtered;
    }

    static async create(notificationData) {
        try {
            const notificationsRef = ref(db, `notifications/${notificationData.userId}`);
            const newNotificationRef = push(notificationsRef);
            
            const notification = new Notification({
                ...notificationData,
                id: newNotificationRef.key
            });

            await set(newNotificationRef, notification.toJSON());
            return newNotificationRef.key;
        } catch (error) {
            console.error("Error creating notification:", error);
            throw new Error("Failed to create notification");
        }
    }

    static async getAll(userId, setNotifications, limit = null) {
        const notificationsRef = ref(db, `notifications/${userId}`);
        let notificationsQuery = query(notificationsRef, orderByChild('date'));
        
        if (limit) {
            notificationsQuery = query(notificationsQuery, limitToLast(limit));
        }

        const unsubscribe = onValue(notificationsQuery, (snapshot) => {
            if (!snapshot.exists()) {
                setNotifications({});
                return;
            }
            const notifications = snapshot.val();
            const filteredNotifications = Notification.filterEnabled(notifications);
            setNotifications(filteredNotifications);
        });

        return () => unsubscribe();
    }

    static async markAsRead(notificationId, userId) {
        try {
            const updates = {};
            updates[`notifications/${userId}/${notificationId}/read`] = true;
            await update(ref(db), updates);
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw new Error("Failed to mark notification as read");
        }
    }

    static async markAllAsRead(userId) {
        console.log(userId);
        try {
            const notificationsRef = ref(db, `notifications/${userId}`);
            const snapshot = await get(notificationsRef);
            
            if (snapshot.exists()) {
                const updates = {};
                snapshot.forEach((childSnapshot) => {
                    updates[`notifications/${userId}/${childSnapshot.key}/read`] = true;
                });
                await update(ref(db), updates);
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            throw new Error("Failed to mark all notifications as read");
        }
    }

    static async getUnreadCount(userId, setCount) {
        const notificationsRef = ref(db, `notifications/${userId}`);
        const unreadQuery = query(
            notificationsRef, 
            orderByChild('read'), 
            equalTo(false)
        );
        
        const unsubscribe = onValue(unreadQuery, (snapshot) => {
            if (!snapshot.exists()) {
                setCount(0);
                return;
            }

            // Filter notifications that are both unread and enabled
            const count = Object.values(snapshot.val()).filter(notification => 
                notification.enabled !== false
            ).length;

            setCount(count);
        });

        return () => unsubscribe();
    }

    static async delete(notificationId, userId) {
        const updates = {};
        updates[`notifications/${userId}/${notificationId}/enabled`] = false;
        await update(ref(db), updates);
    }

    static async getById(notificationId, userId, setNotification) {
        const notificationRef = ref(db, `notifications/${userId}/${notificationId}`);
        const unsubscribe = onValue(notificationRef, (snapshot) => {
            if (!snapshot.exists()) {
                setNotification(null);
                return;
            }
            const data = snapshot.val();
            data.id = notificationId;
            setNotification(new Notification(data));
        });
        return () => unsubscribe();
    }

    static async getByIdOnce(notificationId, userId) {
        const notificationRef = ref(db, `notifications/${userId}/${notificationId}`);
        const snapshot = await get(notificationRef);
        if (!snapshot.exists()) {
            return null;
        }
        const data = snapshot.val();
        data.id = notificationId;
        return new Notification(data);
    }

    static async createBulkNotifications(notifications) {
        try {
            const notificationPromises = notifications.map(async notificationData => {
                const notificationsRef = ref(db, `notifications/${notificationData.userId}`);
                const newNotificationRef = push(notificationsRef);
                
                const notification = new Notification({
                    ...notificationData,
                    id: newNotificationRef.key
                });

                await set(newNotificationRef, notification.toJSON());
                return newNotificationRef.key;
            });

            return await Promise.allSettled(notificationPromises);
        } catch (error) {
            console.error("Error creating bulk notifications:", error);
            throw error;
        }
    }

    static async getAllUsers() {
        try {
            const usersSnapshot = await get(ref(db, 'users'));
            if (!usersSnapshot.exists()) {
                return [];
            }
            return Object.keys(usersSnapshot.val());
        } catch (error) {
            console.error("Error getting all users:", error);
            throw error;
        }
    }

}

export default Notification; 