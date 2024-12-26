"use client";
import Auth from "@/models/Auth";

class AuthController {
  static async adminLogin(email, password, onSuccess, onError) {
    try {
      const user = await Auth.login(email, password);
      const role = await Auth.getUserRole(user.uid);
      if (role !== "Admin") {
        throw new Error("User is not an admin");
      }
      localStorage.setItem("userRole", role);
      onSuccess(user);
    } catch (error) {
      onError(error);
    }
  }

  static async userLogin(email, password, onSuccess, onError) {
    try {
      const user = await Auth.login(email, password);
      const role = await Auth.getUserRole(user.uid);
      if (role !== "User") {
        throw new Error("User is not an user.");
      }
      localStorage.setItem("userRole", role);
      onSuccess(user);
    } catch (error) {
      onError(error);
    }
  }

  static async getCurrentUser() {
    const user = await Auth.getCurrentUser();
    let role = localStorage.getItem("userRole");
    if (!role) {
      role = await Auth.getUserRole(user.uid);
    }
    return { user, role };
  }

  static async signout() {
    await Auth.signout();
  }

  static async getUser(cedula, setUser) {
    await Auth.getUser(cedula, setUser);
  }
}

export default AuthController;
