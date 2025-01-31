import UserActivity from "@/models/UserActivity";
import AuthController from "@/controllers/AuthController";

class UserActivityController {
    static async registerActivity(data) {
        try {
            const currentUser = await AuthController.getCurrentUser();
            if (!currentUser) throw new Error("No user authenticated");

            const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);
            const userData = await AuthController.getUserData(currentUser.user.uid);
            const activityData = {
                ...data,
                userId: cedula,
                userName: userData.name,
                userEmail: userData.email,
                timestamp: new Date().toISOString()
            };

            return await UserActivity.create(activityData);
        } catch (error) {
            console.error("Error registering activity:", error);
            throw error;
        }
    }

    static async getUserActivities(setActivities, limit = null) {
        try {
            const currentUser = await AuthController.getCurrentUser();
            if (!currentUser) throw new Error("No user authenticated");
            
            const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);
            return await UserActivity.getUserActivities(cedula, setActivities, limit);
        } catch (error) {
            console.error("Error getting user activities:", error);
            throw error;
        }
    }

    static async getUserPoints() {
        try {
            const currentUser = await AuthController.getCurrentUser();
            if (!currentUser) throw new Error("No user authenticated");
            
            const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);
            return await UserActivity.getUserPoints(cedula);
        } catch (error) {
            console.error("Error getting user points:", error);
            throw error;
        }
    }

    static async getMonthlyPoints() {
        try {
            const currentUser = await AuthController.getCurrentUser();
            if (!currentUser) throw new Error("No user authenticated");
            
            const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);
            return await UserActivity.getMonthlyPoints(cedula);
        } catch (error) {
            console.error("Error getting monthly points:", error);
            throw error;
        }
    }

    static async getAllActivities(setActivities, limit = null) {
        try {
            return await UserActivity.getAllActivities(setActivities, limit);
        } catch (error) {
            console.error("Error getting all activities:", error);
            throw error;
        }
    }

    static async getTop10Users() {
        try {
            // Get monthly ranking with user details
            const monthlyRanking = await UserActivity.getAllMonthlyPoints();
            
            // Get all activities to map user details
            const activitiesPromise = new Promise((resolve) => {
                UserActivity.getAllActivities((activities) => {
                    resolve(activities);
                });
            });
            
            const activities = await activitiesPromise;
            
            // Map the activities to an array
            const activitiesArray = Object.values(activities);

            // Create top 10 with user details
            const top10 = monthlyRanking
                .slice(0, 10)
                .map(user => {
                    const userActivity = activitiesArray.find(activity => 
                        activity.userId === user.userId
                    );
                    return {
                        userId: user.userId,
                        nombre: userActivity?.userName || 'N/A',
                        email: userActivity?.userEmail || 'No email',
                        puntos: user.points
                    };
                });

            return top10;
        } catch (error) {
            console.error("Error getting top 10 users:", error);
            throw error;
        }
    }
}

export default UserActivityController; 