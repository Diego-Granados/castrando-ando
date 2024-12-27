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

  static async getCurrentRole() {
    let role = localStorage.getItem("userRole");
    if (!role) {
      role = await Auth.getUserRole(user.uid);
    }
    return role;
  }

  static async subscribeToAuthState(callback) {
    const unsubscribe = await Auth.subscribeToAuthState(callback);
    return unsubscribe;
  }

  static async signout() {
    await Auth.signout();
    localStorage.removeItem("userRole");
  }

  static async getUser(cedula, setUser) {
    await Auth.getUser(cedula, setUser);
  }

  static async resetPassword(email) {
    await Auth.resetPassword(email);
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
      // Validaciones básicas
      if (!email || !password || !name || !phone || !cedula) {
        throw new Error("Todos los campos son obligatorios");
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        throw new Error("El correo electrónico no es válido");
      }

      if (!/^\d{8,}$/.test(phone)) {
        throw new Error("El número de teléfono debe tener al menos 8 dígitos");
      }

      await Auth.register(email, password, name, phone, cedula, profileUrl);
      return { ok: true };
    } catch (error) {
      // Personalizar mensajes de error de Firebase
      let errorMessage = "Error al registrar el usuario";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Ya existe una cuenta con este correo electrónico";
          break;
        case "auth/invalid-email":
          errorMessage = "El formato del correo electrónico no es válido";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "El registro de usuarios está deshabilitado temporalmente";
          break;
        case "auth/weak-password":
          errorMessage =
            "La contraseña es demasiado débil. Debe tener al menos 6 caracteres";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Error de conexión. Por favor, verifica tu conexión a internet";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Demasiados intentos fallidos. Por favor, intenta más tarde";
          break;
        default:
          errorMessage = error.message;
      }

      return { ok: false, error: errorMessage };
    }
  }

  static async getUserData(uid) {
    try {
      const userData = await Auth.getUserData(uid);
      return userData;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserProfile(updateData) {
    try {
      const user = await Auth.getCurrentUser();

      // Validaciones
      if (!updateData.name || !updateData.phone) {
        throw new Error("El nombre y teléfono son obligatorios");
      }

      if (!/^\d{8,}$/.test(updateData.phone)) {
        throw new Error("El número de teléfono debe tener al menos 8 dígitos");
      }

      await Auth.updateUserProfile(user.uid, updateData);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error.message || "Error al actualizar el perfil",
      };
    }
  }

  static async deleteAccount() {
    try {
      const user = await Auth.getCurrentUser();
      await Auth.deleteAccount(user.uid);
      localStorage.removeItem("userRole");
      await AuthController.signout();
      return { ok: true };
    } catch (error) {
      let errorMessage = "Error al eliminar la cuenta";

      switch (error.code) {
        case "auth/requires-recent-login":
          errorMessage =
            "Por seguridad, debe volver a iniciar sesión antes de eliminar su cuenta";
          break;
        default:
          errorMessage = error.message;
      }

      return { ok: false, error: errorMessage };
    }
  }
}

export default AuthController;
