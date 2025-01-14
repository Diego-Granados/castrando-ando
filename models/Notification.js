"use client";
import { db } from "@/lib/firebase/config";
import {
    ref,
    get,
    set,
    update,
    onValue,
    push,
    query,
    orderByChild,
    equalTo,
    limitToLast
} from "firebase/database";

class Notification {
    static async create(notification) {
        const notificationsRef = ref(db, `notifications/${notification.userId}`);
        const newNotificationRef = push(notificationsRef);
        await set(newNotificationRef, {
            ...notification,
            id: newNotificationRef.key
        });
    }

    static async getNotifications(userId, setNotifications, limit = null) {
        const notificationsRef = ref(db, `notifications/${userId}`);
        let notificationsQuery = query(notificationsRef, orderByChild('date'));
        
        if (limit) {
            notificationsQuery = query(notificationsQuery, limitToLast(limit));
        }

        const unsubscribe = onValue(notificationsQuery, (snapshot) => {
            if (snapshot.exists()) {
                const notifications = [];
                snapshot.forEach((childSnapshot) => {
                    notifications.unshift({
                        ...childSnapshot.val(),
                        id: childSnapshot.key
                    });
                });
                setNotifications(notifications);
            } else {
                setNotifications([]);
            }
        });

        return unsubscribe;
    }

    static async markAsRead(notificationId, userId) {
        const notificationRef = ref(db, `notifications/${userId}/${notificationId}`);
        await update(notificationRef, { read: true });
    }

    static async markAllAsRead(userId) {
        const notificationsRef = ref(db, `notifications/${userId}`);
        const snapshot = await get(notificationsRef);
        
        if (snapshot.exists()) {
            const updates = {};
            snapshot.forEach((childSnapshot) => {
                updates[`notifications/${userId}/${childSnapshot.key}/read`] = true;
            });
            await update(ref(db), updates);
        }
    }

    static async getUnreadCount(userId, setCount) {
        const notificationsRef = ref(db, `notifications/${userId}`);
        const unreadQuery = query(notificationsRef, orderByChild('read'), equalTo(false));
        
        const unsubscribe = onValue(unreadQuery, (snapshot) => {
            if (snapshot.exists()) {
                setCount(snapshot.size);
            } else {
                setCount(0);
            }
        });

        return unsubscribe;
    }
}

export default Notification; 