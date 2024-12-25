"use client";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";
class Auth {
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser() {
    let user = null;
    // Use onAuthStateChanged to get the current user
    await new Promise((resolve) => {
      onAuthStateChanged(auth, (currentUser) => {
        user = currentUser;
        resolve(); // Resolve the promise when the user is available
      });
    });

    if (!user) {
      localStorage.removeItem("userRole");
      throw new Error("User not authenticated");
    }
    return user;
  }

  static async getUserRole(uid) {
    const userRef = ref(db, "userRoles");
    const snapshot = await get(child(userRef, uid));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return "User";
    }
  }
}

export default Auth;
