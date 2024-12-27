"use client";
import { auth, db } from "@/lib/firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, get, child, set } from "firebase/database";

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

  static async register(
    email,
    password,
    name,
    phone,
    cedula,
    profileUrl = null
  ) {
    try {
      //   // Check if user with cedula already exists
      const userRef = ref(db, `users/${cedula}`);
      //   const snapshot = await get(userRef);
      //   if (snapshot.exists()) {
      //     throw new Error("Ya existe un usuario con esta cédula");
      //   }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user profile in Realtime Database
      await set(userRef, {
        name: name,
        email: email,
        phone: phone,
        uid: userCredential.user.uid,
        profileUrl: profileUrl,
        createdAt: new Date().toISOString(),
        enabled: true,
      });

      // Create user role
      const userRoleRef = ref(db, `userRoles/${userCredential.user.uid}`);
      await set(userRoleRef, "User");

      // Create uid to cedula mapping for easy lookup
      const uidMapRef = ref(db, `uidToCedula/${userCredential.user.uid}`);
      await set(uidMapRef, cedula);

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser() {
    let user = null;
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user = currentUser;
        resolve();
        // Unsubscribe immediately after resolving
        unsubscribe();
      });
    });

    if (!user) {
      localStorage.removeItem("userRole");
      throw new Error("User not authenticated");
    }
    return user;
  }

  static async subscribeToAuthState(callback) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      callback(user);
    });
    return unsubscribe;
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

  static async signout() {
    await signOut(auth);
  }

  static async getUser(cedula, setUser) {
    const userRef = ref(db, `users/${cedula}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      setUser(snapshot.val());
    } else {
      setUser(null);
    }
  }

  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }

  static async getUserData(uid) {
    try {
      // Get cedula from uid mapping
      const uidMapRef = ref(db, `uidToCedula/${uid}`);
      const uidMapSnapshot = await get(uidMapRef);
      if (!uidMapSnapshot.exists()) {
        throw new Error("Usuario no encontrado");
      }
      const cedula = uidMapSnapshot.val();

      // Get user data using cedula
      const userRef = ref(db, `users/${cedula}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return { ...snapshot.val(), id: cedula };
      }
      throw new Error("Usuario no encontrado");
    } catch (error) {
      throw error;
    }
  }

  static async updateUserProfile(uid, updateData) {
    try {
      // Get cedula from uid mapping
      const uidMapRef = ref(db, `uidToCedula/${uid}`);
      const uidMapSnapshot = await get(uidMapRef);
      if (!uidMapSnapshot.exists()) {
        throw new Error("Usuario no encontrado");
      }
      const cedula = uidMapSnapshot.val();

      // Update user data using cedula
      const userRef = ref(db, `users/${cedula}`);
      await set(userRef, {
        ...updateData,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async deleteAccount(uid) {
    try {
      // Delete user from Firebase Auth
      await auth.currentUser.delete();

      // Get cedula from uid mapping
      const uidMapRef = ref(db, `uidToCedula/${uid}`);
      const uidMapSnapshot = await get(uidMapRef);
      if (!uidMapSnapshot.exists()) {
        throw new Error("Usuario no encontrado");
      }
      const cedula = uidMapSnapshot.val();

      // Delete user data from Realtime Database
      const userRef = ref(db, `users/${cedula}/enabled`);
      await set(userRef, false);

      // Delete user role
      const userRoleRef = ref(db, `userRoles/${uid}`);
      await set(userRoleRef, null);

      // Delete uid mapping
      await set(uidMapRef, null);

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default Auth;
