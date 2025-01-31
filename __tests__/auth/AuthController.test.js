import AuthController from "@/controllers/AuthController";
import Auth from "@/models/Auth";
import { NextResponse } from "next/server";

// Mock Auth model
jest.mock("@/models/Auth");

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe("adminLogin", () => {
    const mockEmail = "admin@example.com";
    const mockPassword = "password123";
    const mockUser = { uid: "admin-1", email: mockEmail };
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    it("debería autenticar exitosamente a un administrador", async () => {
      Auth.login.mockResolvedValue(mockUser);
      Auth.getUserRole.mockResolvedValue("Admin");

      await AuthController.adminLogin(
        mockEmail,
        mockPassword,
        mockOnSuccess,
        mockOnError
      );

      expect(Auth.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "userRole",
        "Admin"
      );
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it("debería manejar error cuando el usuario no es administrador", async () => {
      Auth.login.mockResolvedValue(mockUser);
      Auth.getUserRole.mockResolvedValue("User");

      await AuthController.adminLogin(
        mockEmail,
        mockPassword,
        mockOnSuccess,
        mockOnError
      );

      expect(Auth.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(
        new Error("User is not an admin")
      );
    });

    it("debería manejar error de autenticación", async () => {
      const error = new Error("Invalid credentials");
      Auth.login.mockRejectedValue(error);

      await AuthController.adminLogin(
        mockEmail,
        mockPassword,
        mockOnSuccess,
        mockOnError
      );

      expect(Auth.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Auth.getUserRole).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(error);
    });

    it("debería manejar error al obtener el rol del usuario", async () => {
      const error = new Error("Error getting user role");
      Auth.login.mockResolvedValue(mockUser);
      Auth.getUserRole.mockRejectedValue(error);

      await AuthController.adminLogin(
        mockEmail,
        mockPassword,
        mockOnSuccess,
        mockOnError
      );

      expect(Auth.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(error);
    });
  });

  describe("userLogin", () => {
    const mockEmail = "user@example.com";
    const mockPassword = "password123";
    const mockUser = { uid: "user-1", email: mockEmail };
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    it("debería autenticar exitosamente a un usuario normal", async () => {
      Auth.login.mockResolvedValue(mockUser);
      Auth.getUserRole.mockResolvedValue("User");

      await AuthController.userLogin(
        mockEmail,
        mockPassword,
        mockOnSuccess,
        mockOnError
      );

      expect(Auth.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("userRole", "User");
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it("debería manejar error cuando el usuario es administrador", async () => {
      Auth.login.mockResolvedValue(mockUser);
      Auth.getUserRole.mockResolvedValue("Admin");

      await AuthController.userLogin(
        mockEmail,
        mockPassword,
        mockOnSuccess,
        mockOnError
      );

      expect(Auth.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(
        new Error("User is not an user.")
      );
    });

    it("debería manejar error de autenticación", async () => {
      const error = new Error("Invalid credentials");
      Auth.login.mockRejectedValue(error);

      await AuthController.userLogin(
        mockEmail,
        mockPassword,
        mockOnSuccess,
        mockOnError
      );

      expect(Auth.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Auth.getUserRole).not.toHaveBeenCalled();
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(error);
    });

    it("debería manejar error al obtener el rol del usuario", async () => {
      const error = new Error("Error getting user role");
      Auth.login.mockResolvedValue(mockUser);
      Auth.getUserRole.mockRejectedValue(error);

      await AuthController.userLogin(
        mockEmail,
        mockPassword,
        mockOnSuccess,
        mockOnError
      );

      expect(Auth.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith(error);
    });
  });

  describe("getCurrentUser", () => {
    const mockUser = { uid: "user-1", email: "test@example.com" };

    it("debería obtener el usuario actual y su rol desde localStorage", async () => {
      Auth.getCurrentUser.mockResolvedValue(mockUser);
      mockLocalStorage.getItem.mockReturnValue("User");

      const result = await AuthController.getCurrentUser();

      expect(Auth.getCurrentUser).toHaveBeenCalled();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("userRole");
      expect(result).toEqual({
        user: mockUser,
        role: "User",
      });
      expect(Auth.getUserRole).not.toHaveBeenCalled();
    });

    it("debería obtener el rol del usuario cuando no está en localStorage", async () => {
      Auth.getCurrentUser.mockResolvedValue(mockUser);
      mockLocalStorage.getItem.mockReturnValue(null);
      Auth.getUserRole.mockResolvedValue("Admin");

      const result = await AuthController.getCurrentUser();

      expect(Auth.getCurrentUser).toHaveBeenCalled();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("userRole");
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
      expect(result).toEqual({
        user: mockUser,
        role: "Admin",
      });
    });

    it("debería manejar error cuando el usuario no está autenticado", async () => {
      Auth.getCurrentUser.mockRejectedValue(
        new Error("User not authenticated")
      );

      await expect(AuthController.getCurrentUser()).rejects.toThrow(
        "User not authenticated"
      );
      expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
      expect(Auth.getUserRole).not.toHaveBeenCalled();
    });

    it("debería manejar error al obtener el rol del usuario", async () => {
      Auth.getCurrentUser.mockResolvedValue(mockUser);
      mockLocalStorage.getItem.mockReturnValue(null);
      Auth.getUserRole.mockRejectedValue(new Error("Error getting user role"));

      await expect(AuthController.getCurrentUser()).rejects.toThrow(
        "Error getting user role"
      );
      expect(Auth.getCurrentUser).toHaveBeenCalled();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("userRole");
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
    });
  });

  describe("getUserId", () => {
    const mockUser = { uid: "user-1", email: "test@example.com" };

    it("debería obtener el ID del usuario actual", async () => {
      Auth.getCurrentUser.mockResolvedValue(mockUser);

      const result = await AuthController.getUserId();

      expect(Auth.getCurrentUser).toHaveBeenCalled();
      expect(result).toBe(mockUser.uid);
    });

    it("debería manejar error cuando el usuario no está autenticado", async () => {
      Auth.getCurrentUser.mockRejectedValue(
        new Error("User not authenticated")
      );

      await expect(AuthController.getUserId()).rejects.toThrow(
        "User not authenticated"
      );
      expect(Auth.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe("getCurrentRole", () => {
    const mockUser = { uid: "user-1", email: "test@example.com" };

    it("debería obtener el rol desde localStorage si está disponible", async () => {
      mockLocalStorage.getItem.mockReturnValue("Admin");

      const result = await AuthController.getCurrentRole(mockUser);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("userRole");
      expect(Auth.getUserRole).not.toHaveBeenCalled();
      expect(result).toBe("Admin");
    });

    it("debería obtener el rol desde la base de datos si no está en localStorage", async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      Auth.getUserRole.mockResolvedValue("User");

      const result = await AuthController.getCurrentRole(mockUser);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("userRole");
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
      expect(result).toBe("User");
    });

    it("debería manejar error al obtener el rol desde la base de datos", async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      Auth.getUserRole.mockRejectedValue(new Error("Error getting user role"));

      await expect(AuthController.getCurrentRole(mockUser)).rejects.toThrow(
        "Error getting user role"
      );
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("userRole");
      expect(Auth.getUserRole).toHaveBeenCalledWith(mockUser.uid);
    });
  });

  describe("subscribeToAuthState", () => {
    it("debería suscribirse a cambios de estado de autenticación", async () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      Auth.subscribeToAuthState.mockResolvedValue(mockUnsubscribe);

      const unsubscribe = await AuthController.subscribeToAuthState(
        mockCallback
      );

      expect(Auth.subscribeToAuthState).toHaveBeenCalledWith(mockCallback);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it("debería manejar error en la suscripción", async () => {
      const mockCallback = jest.fn();
      Auth.subscribeToAuthState.mockRejectedValue(
        new Error("Subscription error")
      );

      await expect(
        AuthController.subscribeToAuthState(mockCallback)
      ).rejects.toThrow("Subscription error");
    });
  });

  describe("signout", () => {
    it("debería cerrar sesión exitosamente", async () => {
      Auth.signout.mockResolvedValue();

      await AuthController.signout();

      expect(Auth.signout).toHaveBeenCalled();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("userRole");
    });

    it("debería manejar error al cerrar sesión", async () => {
      Auth.signout.mockRejectedValue(new Error("Signout error"));

      await expect(AuthController.signout()).rejects.toThrow("Signout error");
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith("userRole");
    });
  });

  describe("getUser", () => {
    const mockCedula = "123456789";
    const mockSetUser = jest.fn();
    const mockUserData = {
      name: "Test User",
      email: "test@example.com",
      phone: "12345678",
    };

    it("debería obtener datos del usuario por cédula", async () => {
      Auth.getUser.mockImplementation((cedula, callback) => {
        callback(mockUserData);
        return Promise.resolve();
      });

      await AuthController.getUser(mockCedula, mockSetUser);

      expect(Auth.getUser).toHaveBeenCalledWith(
        mockCedula,
        expect.any(Function)
      );
      expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
    });

    it("debería manejar el caso cuando el usuario no existe", async () => {
      Auth.getUser.mockImplementation((cedula, callback) => {
        callback(null);
        return Promise.resolve();
      });

      await AuthController.getUser(mockCedula, mockSetUser);

      expect(Auth.getUser).toHaveBeenCalledWith(
        mockCedula,
        expect.any(Function)
      );
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });

    it("debería manejar error al obtener usuario", async () => {
      Auth.getUser.mockRejectedValue(new Error("Error getting user"));

      await expect(
        AuthController.getUser(mockCedula, mockSetUser)
      ).rejects.toThrow("Error getting user");
    });
  });

  describe("resetPassword", () => {
    const mockEmail = "test@example.com";

    it("debería enviar email de restablecimiento exitosamente", async () => {
      Auth.resetPassword.mockResolvedValue();

      await AuthController.resetPassword(mockEmail);

      expect(Auth.resetPassword).toHaveBeenCalledWith(mockEmail);
    });

    it("debería manejar error al enviar email de restablecimiento", async () => {
      Auth.resetPassword.mockRejectedValue(new Error("Reset password error"));

      await expect(AuthController.resetPassword(mockEmail)).rejects.toThrow(
        "Reset password error"
      );
    });

    it("debería manejar error con email inválido", async () => {
      Auth.resetPassword.mockRejectedValue(new Error("auth/invalid-email"));

      await expect(
        AuthController.resetPassword("invalid-email")
      ).rejects.toThrow("auth/invalid-email");
    });

    it("debería manejar error cuando el usuario no existe", async () => {
      Auth.resetPassword.mockRejectedValue(new Error("auth/user-not-found"));

      await expect(AuthController.resetPassword(mockEmail)).rejects.toThrow(
        "auth/user-not-found"
      );
    });
  });

  describe("register", () => {
    const mockUserData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      phone: "12345678",
      cedula: "123456789",
      profileUrl: "https://example.com/photo.jpg",
    };

    it("debería registrar un nuevo usuario exitosamente", async () => {
      Auth.register.mockResolvedValue({ ok: true });

      const result = await AuthController.register(
        mockUserData.email,
        mockUserData.password,
        mockUserData.name,
        mockUserData.phone,
        mockUserData.cedula,
        mockUserData.profileUrl
      );

      expect(Auth.register).toHaveBeenCalledWith(
        mockUserData.email,
        mockUserData.password,
        mockUserData.name,
        mockUserData.phone,
        mockUserData.cedula,
        mockUserData.profileUrl
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería validar campos obligatorios", async () => {
      const incompleteData = {
        email: "",
        password: "password123",
        name: "Test User",
        phone: "12345678",
        cedula: "123456789",
      };

      const result = await AuthController.register(
        incompleteData.email,
        incompleteData.password,
        incompleteData.name,
        incompleteData.phone,
        incompleteData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "Todos los campos son obligatorios",
      });
      expect(Auth.register).not.toHaveBeenCalled();
    });

    it("debería validar contraseña débil", async () => {
      const weakPasswordData = {
        ...mockUserData,
        password: "123",
      };

      const result = await AuthController.register(
        weakPasswordData.email,
        weakPasswordData.password,
        weakPasswordData.name,
        weakPasswordData.phone,
        weakPasswordData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      });
      expect(Auth.register).not.toHaveBeenCalled();
    });

    it("debería validar formato de email", async () => {
      const invalidEmailData = {
        ...mockUserData,
        email: "invalid-email",
      };

      const result = await AuthController.register(
        invalidEmailData.email,
        invalidEmailData.password,
        invalidEmailData.name,
        invalidEmailData.phone,
        invalidEmailData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "El correo electrónico no es válido",
      });
      expect(Auth.register).not.toHaveBeenCalled();
    });

    it("debería validar formato de teléfono", async () => {
      const invalidPhoneData = {
        ...mockUserData,
        phone: "123",
      };

      const result = await AuthController.register(
        invalidPhoneData.email,
        invalidPhoneData.password,
        invalidPhoneData.name,
        invalidPhoneData.phone,
        invalidPhoneData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "El número de teléfono debe tener al menos 8 dígitos",
      });
      expect(Auth.register).not.toHaveBeenCalled();
    });

    it("debería manejar error de email ya en uso", async () => {
      Auth.register.mockRejectedValue({ code: "auth/email-already-in-use" });

      const result = await AuthController.register(
        mockUserData.email,
        mockUserData.password,
        mockUserData.name,
        mockUserData.phone,
        mockUserData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "Ya existe una cuenta con este correo electrónico",
      });
    });

    it("debería manejar error de email inválido", async () => {
      Auth.register.mockRejectedValue({ code: "auth/invalid-email" });

      const result = await AuthController.register(
        mockUserData.email,
        mockUserData.password,
        mockUserData.name,
        mockUserData.phone,
        mockUserData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "El formato del correo electrónico no es válido",
      });
    });

    it("debería manejar error de operación no permitida", async () => {
      Auth.register.mockRejectedValue({ code: "auth/operation-not-allowed" });

      const result = await AuthController.register(
        mockUserData.email,
        mockUserData.password,
        mockUserData.name,
        mockUserData.phone,
        mockUserData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "El registro de usuarios está deshabilitado temporalmente",
      });
    });

    it("debería manejar error de red", async () => {
      Auth.register.mockRejectedValue({ code: "auth/network-request-failed" });

      const result = await AuthController.register(
        mockUserData.email,
        mockUserData.password,
        mockUserData.name,
        mockUserData.phone,
        mockUserData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "Error de conexión. Por favor, verifica tu conexión a internet",
      });
    });

    it("debería manejar error de demasiados intentos", async () => {
      Auth.register.mockRejectedValue({ code: "auth/too-many-requests" });

      const result = await AuthController.register(
        mockUserData.email,
        mockUserData.password,
        mockUserData.name,
        mockUserData.phone,
        mockUserData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: "Demasiados intentos fallidos. Por favor, intenta más tarde",
      });
    });

    it("debería manejar errores genéricos", async () => {
      const genericError = new Error("Error genérico");
      Auth.register.mockRejectedValue(genericError);

      const result = await AuthController.register(
        mockUserData.email,
        mockUserData.password,
        mockUserData.name,
        mockUserData.phone,
        mockUserData.cedula
      );

      expect(result).toEqual({
        ok: false,
        error: genericError.message,
      });
    });
  });

  describe("getUserData", () => {
    const mockUserId = "user-1";
    const mockUserData = {
      id: "123456789",
      name: "Test User",
      email: "test@example.com",
      phone: "12345678",
      profileUrl: "https://example.com/photo.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
      enabled: true,
    };

    it("debería obtener datos del usuario exitosamente", async () => {
      Auth.getUserData.mockResolvedValue(mockUserData);

      const result = await AuthController.getUserData(mockUserId);

      expect(Auth.getUserData).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUserData);
    });

    it("debería manejar error cuando el usuario no existe", async () => {
      Auth.getUserData.mockRejectedValue(new Error("Usuario no encontrado"));

      await expect(AuthController.getUserData(mockUserId)).rejects.toThrow(
        "Usuario no encontrado"
      );
      expect(Auth.getUserData).toHaveBeenCalledWith(mockUserId);
    });

    it("debería manejar error de base de datos", async () => {
      Auth.getUserData.mockRejectedValue(new Error("Error de base de datos"));

      await expect(AuthController.getUserData(mockUserId)).rejects.toThrow(
        "Error de base de datos"
      );
      expect(Auth.getUserData).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("updateUserProfile", () => {
    const mockUserId = "user-1";
    const mockUser = { uid: mockUserId };
    const mockProfileData = {
      name: "Updated Name",
      email: "updated@example.com",
      phone: "87654321",
      profileUrl: "https://example.com/new-photo.jpg",
    };

    beforeEach(() => {
      // Mock getCurrentUser to return a valid user for all tests in this describe block
      Auth.getCurrentUser.mockResolvedValue(mockUser);
    });

    it("debería actualizar el perfil del usuario exitosamente", async () => {
      Auth.updateUserProfile.mockResolvedValue(true);

      const result = await AuthController.updateUserProfile(mockProfileData);

      expect(Auth.getCurrentUser).toHaveBeenCalled();
      expect(Auth.updateUserProfile).toHaveBeenCalledWith(
        mockUserId,
        mockProfileData
      );
      expect(result).toEqual({ ok: true });
    });

    it("debería validar campos obligatorios", async () => {
      const incompleteData = {
        name: "",
        email: "updated@example.com",
        phone: "87654321",
      };

      const result = await AuthController.updateUserProfile(incompleteData);

      expect(result).toEqual({
        ok: false,
        error: "El nombre y teléfono son obligatorios",
      });
      expect(Auth.updateUserProfile).not.toHaveBeenCalled();
    });

    it("debería validar formato de teléfono", async () => {
      const invalidPhoneData = {
        ...mockProfileData,
        phone: "123",
      };

      const result = await AuthController.updateUserProfile(invalidPhoneData);

      expect(result).toEqual({
        ok: false,
        error: "El número de teléfono debe tener al menos 8 dígitos",
      });
      expect(Auth.updateUserProfile).not.toHaveBeenCalled();
    });

    it("debería manejar error cuando el usuario no existe", async () => {
      Auth.updateUserProfile.mockRejectedValue(
        new Error("Usuario no encontrado")
      );

      const result = await AuthController.updateUserProfile(mockProfileData);

      expect(result).toEqual({
        ok: false,
        error: "Usuario no encontrado",
      });
    });

    it("debería manejar error de email ya en uso", async () => {
      Auth.updateUserProfile.mockRejectedValue({
        code: "auth/email-already-in-use",
        message: "Ya existe una cuenta con este correo electrónico",
      });

      const result = await AuthController.updateUserProfile(mockProfileData);

      expect(result).toEqual({
        ok: false,
        error: "Ya existe una cuenta con este correo electrónico",
      });
    });

    it("debería manejar error de operación no permitida", async () => {
      Auth.updateUserProfile.mockRejectedValue({
        code: "auth/operation-not-allowed",
        message:
          "La actualización del perfil no está permitida en este momento",
      });

      const result = await AuthController.updateUserProfile(mockProfileData);

      expect(result).toEqual({
        ok: false,
        error: "La actualización del perfil no está permitida en este momento",
      });
    });

    it("debería manejar error de red", async () => {
      Auth.updateUserProfile.mockRejectedValue({
        code: "auth/network-request-failed",
        message:
          "Error de conexión. Por favor, verifica tu conexión a internet",
      });

      const result = await AuthController.updateUserProfile(mockProfileData);

      expect(result).toEqual({
        ok: false,
        error: "Error de conexión. Por favor, verifica tu conexión a internet",
      });
    });

    it("debería manejar error cuando el usuario no está autenticado", async () => {
      Auth.getCurrentUser.mockRejectedValue(
        new Error("User not authenticated")
      );

      const result = await AuthController.updateUserProfile(mockProfileData);

      expect(result).toEqual({
        ok: false,
        error: "User not authenticated",
      });
    });

    it("debería manejar errores genéricos", async () => {
      const genericError = new Error("Error inesperado");
      Auth.updateUserProfile.mockRejectedValue(genericError);

      const result = await AuthController.updateUserProfile(mockProfileData);

      expect(result).toEqual({
        ok: false,
        error: "Error inesperado",
      });
    });
  });

  describe("deleteAccount", () => {
    const mockUserId = "user-1";
    const mockUser = { uid: mockUserId };
    beforeEach(() => {
      Auth.getCurrentUser.mockResolvedValue(mockUser);
      // Clear all mocks before each test
      jest.clearAllMocks();
    });

    it("debería eliminar la cuenta exitosamente", async () => {
      Auth.deleteAccount.mockResolvedValue(true);
      Auth.signout.mockResolvedValue();

      const result = await AuthController.deleteAccount(mockUserId);

      expect(Auth.getCurrentUser).toHaveBeenCalled();
      expect(Auth.deleteAccount).toHaveBeenCalledWith(mockUserId);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("userRole");
      expect(result).toEqual({ ok: true });
    });

    it("debería manejar error de reautenticación requerida", async () => {
      Auth.deleteAccount.mockRejectedValue({
        code: "auth/requires-recent-login",
        message:
          "Por seguridad, debe volver a iniciar sesión antes de eliminar su cuenta",
      });

      const result = await AuthController.deleteAccount(mockUserId);

      expect(result).toEqual({
        ok: false,
        error:
          "Por seguridad, debe volver a iniciar sesión antes de eliminar su cuenta",
      });
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it("debería manejar error de operación no permitida", async () => {
      Auth.deleteAccount.mockRejectedValue({
        code: "auth/operation-not-allowed",
        message: "La eliminación de cuenta no está permitida en este momento",
      });

      const result = await AuthController.deleteAccount(mockUserId);

      expect(result).toEqual({
        ok: false,
        error: "La eliminación de cuenta no está permitida en este momento",
      });
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe("getCedulaByUserId", () => {
    const mockUserId = "user-1";
    const mockCedula = "123456789";

    it("debería obtener la cédula exitosamente", async () => {
      Auth.getCedulaByUserId.mockResolvedValue(mockCedula);

      const result = await AuthController.getCedulaByUserId(mockUserId);

      expect(Auth.getCedulaByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(mockCedula);
    });

    it("debería manejar error cuando el usuario no existe", async () => {
      Auth.getCedulaByUserId.mockRejectedValue(
        new Error("Usuario no encontrado")
      );

      await expect(
        AuthController.getCedulaByUserId(mockUserId)
      ).rejects.toThrow("Usuario no encontrado");
      expect(Auth.getCedulaByUserId).toHaveBeenCalledWith(mockUserId);
    });
  });
});
