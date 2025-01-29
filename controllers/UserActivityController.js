import UserActivity from "@/models/UserActivity";
import AuthController from "@/controllers/AuthController";

class UserActivityController {
    static async registerActivity(data) {
        try {
            const currentUser = await AuthController.getCurrentUser();
            if (!currentUser) throw new Error("No user authenticated");

            const cedula = await AuthController.getCedulaByUserId(currentUser.user.uid);
            
            const activityData = {
                ...data,
                userId: cedula,
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
}

export default UserActivityController; 