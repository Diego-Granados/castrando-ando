"use client";
import { db } from "@/lib/firebase/config";
import {
    ref,
    get,
    set,
    query,
    push,
    orderByChild,
    limitToLast,
    onValue
} from "firebase/database";

class UserActivity {
    constructor(data) {
        this.id = data.id;
        this.type = data.type;
        this.description = data.description;
        this.userId = data.userId;
        this.points = data.points || this.getPointsForType(data.type);
        this.timestamp = data.timestamp || new Date().toISOString();
        this.metadata = data.metadata || {};
        this.enabled = data.enabled !== false;

        this.validate();
    }

    validate() {
        if (!this.type) throw new Error("Activity must have a type");
        if (!this.description) throw new Error("Activity must have a description");
        if (!this.userId) throw new Error("Activity must have a userId");
    }

    getPointsForType(type) {
        const pointsMap = {
            CAMPAIGN_SIGNUP: 10,        // Inscripciones a campañas
            LOST_PET_POST: 10,           // Publicación animales perdidos
            ADOPTION_POST: 8,           // Publicación animales adopción
            ACTIVITY_SIGNUP: 6,         // Inscripciones a actividad
            CAMPAIGN_COMMENT: 2,        // Comentario en campañas
            ACTIVITY_COMMENT: 2,        // Comentario en actividad
            LOST_PET_COMMENT: 2,        // Comentarios en publicación animales perdidos
            FORUM_POST: 2,              // Participaciones en foros
            BLOG_COMMENT: 2             // Comentario en blog
        };
        return pointsMap[type] || 0;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            description: this.description,
            userId: this.userId,
            points: this.points,
            timestamp: this.timestamp,
            metadata: this.metadata,
            enabled: this.enabled
        };
    }

    static filterEnabled(activities) {
        if (!activities) return {};
        
        const filtered = {};
        Object.keys(activities).forEach((key) => {
            if (activities[key].enabled !== false) {
                activities[key].id = key;
                try {
                    filtered[key] = new UserActivity(activities[key]);
                } catch (error) {
                    console.error(`Error creating UserActivity instance for key ${key}:`, error);
                }
            }
        });
        return filtered;
    }

    static async create(activityData) {
        try {
            const activitiesRef = ref(db, `userActivities/${activityData.userId}`);
            const newActivityRef = push(activitiesRef);
            
            const activity = new UserActivity({
                ...activityData,
                id: newActivityRef.key
            });

            await set(newActivityRef, activity.toJSON());

            // Update user points
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // +1 because getMonth() returns 0-11
            
            // Update total points
            const totalPointsRef = ref(db, `userPoints/${activityData.userId}/total`);
            const totalPointsSnapshot = await get(totalPointsRef);
            const currentTotalPoints = totalPointsSnapshot.exists() ? totalPointsSnapshot.val() : 0;
            await set(totalPointsRef, currentTotalPoints + activity.points);
            
            // Update monthly points
            const monthlyPointsRef = ref(db, `userPoints/${activityData.userId}/monthly/${year}/${month}`);
            const monthlyPointsSnapshot = await get(monthlyPointsRef);
            const currentMonthlyPoints = monthlyPointsSnapshot.exists() ? monthlyPointsSnapshot.val() : 0;
            await set(monthlyPointsRef, currentMonthlyPoints + activity.points);

            return newActivityRef.key;
        } catch (error) {
            console.error("Error creating activity:", error);
            throw new Error("Failed to create activity");
        }
    }

    static async getUserActivities(userId, setActivities, limit = null) {
        const activitiesRef = ref(db, `userActivities/${userId}`);
        let activitiesQuery = query(activitiesRef, orderByChild('timestamp'));
        
        if (limit) {
            activitiesQuery = query(activitiesQuery, limitToLast(limit));
        }

        const unsubscribe = onValue(activitiesQuery, (snapshot) => {
            if (!snapshot.exists()) {
                setActivities([]);
                return;
            }
            const activities = snapshot.val();
            const filteredActivities = UserActivity.filterEnabled(activities);
            const activitiesArray = Object.values(filteredActivities)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setActivities(activitiesArray);
        });

        return () => unsubscribe();
    }

    static async getUserPoints(userId) {
        const pointsRef = ref(db, `userPoints/${userId}/total`);
        const snapshot = await get(pointsRef);
        return snapshot.exists() ? snapshot.val() : 0;
    }

    static async getAllActivities(setActivities, limit = null) {
        const activitiesRef = ref(db, 'userActivities');
        
        const unsubscribe = onValue(activitiesRef, async (snapshot) => {
            if (!snapshot.exists()) {
                setActivities([]);
                return;
            }

            const allActivities = [];
            const users = snapshot.val();

            for (const userId in users) {
                const userActivities = users[userId];
                for (const activityId in userActivities) {
                    if (userActivities[activityId].enabled !== false) {
                        const activity = new UserActivity({
                            ...userActivities[activityId],
                            id: activityId
                        });
                        allActivities.push(activity);
                    }
                }
            }

            // Sort by timestamp descending
            allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            if (limit) {
                setActivities(allActivities.slice(0, limit));
            } else {
                setActivities(allActivities);
            }
        });

        return () => unsubscribe();
    }

    static async getMonthlyPoints(userId) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const monthlyPointsRef = ref(db, `userPoints/${userId}/monthly/${currentYear}/${currentMonth}`);
        const snapshot = await get(monthlyPointsRef);
        return snapshot.exists() ? snapshot.val() : 0;
    }

    static async getYearlyPoints(userId, year = null) {
        if (!year) {
            year = new Date().getFullYear();
        }
        
        const yearlyPointsRef = ref(db, `userPoints/${userId}/monthly/${year}`);
        const snapshot = await get(yearlyPointsRef);
        
        if (!snapshot.exists()) return 0;
        
        // Sum all months in the year
        return Object.values(snapshot.val()).reduce((sum, points) => sum + points, 0);
    }

    static async getAllMonthlyPoints(year = null, month = null) {
        if (!year || !month) {
            const now = new Date();
            year = year || now.getFullYear();
            month = month || now.getMonth() + 1;
        }

        const pointsRef = ref(db, 'userPoints');
        const snapshot = await get(pointsRef);
        
        if (!snapshot.exists()) return [];

        const monthlyRanking = [];
        const users = snapshot.val();

        for (const userId in users) {
            if (users[userId].monthly?.[year]?.[month]) {
                monthlyRanking.push({
                    userId,
                    points: users[userId].monthly[year][month]
                });
            }
        }

        return monthlyRanking.sort((a, b) => b.points - a.points);
    }
}

export default UserActivity; 