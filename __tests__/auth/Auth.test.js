import Auth from "@/models/Auth";
import { auth, db } from "@/lib/firebase/config";
import { ref, get, set, update, child } from "firebase/database";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";

// Mock Firebase
jest.mock("@/lib/firebase/config", () => ({
  auth: {
    currentUser: {
      delete: jest.fn(),
    },
  },
  db: {},
}));

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  child: jest.fn(),
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

describe("Auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem.mockClear();
    // Restore console.log to prevent test pollution
    console.log = jest.fn();
  });
  const mockDate = "2024-01-01T00:00:00.000Z";
  jest.spyOn(global.Date.prototype, "toISOString").mockReturnValue(mockDate);

  describe("login", () => {
    it("debería iniciar sesión exitosamente", async () => {
      const mockEmail = "test@example.com";
      const mockPassword = "password123";
      const mockUserCredential = {
        user: { uid: "user-1", email: mockEmail },
      };

      signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);
      ref.mockReturnValue("dbRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => ({ role: "User" }),
      });

      const result = await Auth.login(mockEmail, mockPassword);

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        mockEmail,
        mockPassword
      );
      expect(result).toEqual({ uid: "user-1", email: mockEmail });
    });

    it("debería manejar error de credenciales inválidas", async () => {
      const mockEmail = "test@example.com";
      const mockPassword = "wrongpassword";

      signInWithEmailAndPassword.mockRejectedValue(
        new Error("auth/invalid-credential")
      );
      await expect(Auth.login(mockEmail, mockPassword)).rejects.toThrow(
        "auth/invalid-credential"
      );
    });

    it("debería manejar error de usuario no encontrado", async () => {
      const mockEmail = "nonexistent@example.com";
      const mockPassword = "password123";

      signInWithEmailAndPassword.mockRejectedValue(
        new Error("auth/user-not-found")
      );

      await expect(Auth.login(mockEmail, mockPassword)).rejects.toThrow(
        "auth/user-not-found"
      );
    });
  });

  describe("register", () => {
    it("debería registrar un nuevo usuario exitosamente", async () => {
      const mockEmail = "newuser@example.com";
      const mockPassword = "password123";
      const mockName = "Juan Perez";
      const mockPhone = "12345678";
      const mockId = "123456789";
      const mockUserCredential = {
        user: { uid: "user-1", email: mockEmail },
      };

      createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
      ref.mockReturnValue("dbRef");
      set.mockResolvedValue();

      const result = await Auth.register(
        mockEmail,
        mockPassword,
        mockName,
        mockPhone,
        mockId
      );

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        mockEmail,
        mockPassword
      );
      // First call - creating user profile
      expect(ref).toHaveBeenNthCalledWith(1, db, `users/${mockId}`);
      expect(set).toHaveBeenNthCalledWith(1, "dbRef", {
        name: mockName,
        email: mockEmail,
        phone: mockPhone,
        uid: mockUserCredential.user.uid,
        profileUrl: null,
        createdAt: mockDate,
        enabled: true,
      });

      // Second call - setting user role
      expect(ref).toHaveBeenNthCalledWith(
        2,
        db,
        `userRoles/${mockUserCredential.user.uid}`
      );
      expect(set).toHaveBeenNthCalledWith(2, "dbRef", "User");

      // Third call - creating uid to cedula mapping
      expect(ref).toHaveBeenNthCalledWith(
        3,
        db,
        `uidToCedula/${mockUserCredential.user.uid}`
      );
      expect(set).toHaveBeenNthCalledWith(3, "dbRef", mockId);

      expect(result).toEqual(mockUserCredential);
    });

    it("debería manejar error de email ya en uso", async () => {
      const mockEmail = "existing@example.com";
      const mockPassword = "password123";
      const mockName = "John Doe";
      const mockPhone = "12345678";
      const mockId = "123456789";

      createUserWithEmailAndPassword.mockRejectedValue(
        new Error("auth/email-already-exists")
      );

      await expect(
        Auth.register(mockEmail, mockPassword, mockName, mockPhone, mockId)
      ).rejects.toThrow("auth/email-already-exists");
    });

    it("debería manejar error de contraseña inválida", async () => {
      const mockEmail = "test@example.com";
      const mockPassword = "123";
      const mockName = "John Doe";
      const mockPhone = "12345678";
      const mockId = "123456789";

      createUserWithEmailAndPassword.mockRejectedValue(
        new Error("auth/invalid-password")
      );

      await expect(
        Auth.register(mockEmail, mockPassword, mockName, mockPhone, mockId)
      ).rejects.toThrow("auth/invalid-password");
    });
  });

  describe("signout", () => {
    it("debería cerrar sesión exitosamente", async () => {
      signOut.mockResolvedValue();

      await Auth.signout();

      expect(signOut).toHaveBeenCalledWith(auth);
    });

    it("debería manejar errores al cerrar sesión", async () => {
      signOut.mockRejectedValue(new Error("Error al cerrar sesión"));

      await expect(Auth.signout()).rejects.toThrow("Error al cerrar sesión");
    });
  });

  describe("getCurrentUser", () => {
    it("debería obtener el usuario actual y su rol", async () => {
      const mockUser = { uid: "user-1", email: "test@example.com" };

      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return () => {};
      });

      const result = await Auth.getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it("debería manejar el caso de usuario no autenticado", async () => {
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null);
        return () => {};
      });

      await expect(Auth.getCurrentUser()).rejects.toThrow(
        "User not authenticated"
      );

      expect(localStorage.removeItem).toHaveBeenCalledWith("userRole");
    });
  });

  describe("subscribeToAuthState", () => {
    it("debería suscribirse a cambios de estado de autenticación", async () => {
      const mockUser = { uid: "user-1", email: "test@example.com" };
      const mockUnsubscribe = jest.fn();
      const mockCallback = jest.fn();

      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return mockUnsubscribe;
      });

      const unsubscribe = await Auth.subscribeToAuthState(mockCallback);

      expect(onAuthStateChanged).toHaveBeenCalledWith(
        auth,
        expect.any(Function)
      );
      expect(mockCallback).toHaveBeenCalledWith(mockUser);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it("debería manejar el caso de usuario no autenticado en la suscripción", async () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();

      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null);
        return mockUnsubscribe;
      });

      const unsubscribe = await Auth.subscribeToAuthState(mockCallback);

      expect(onAuthStateChanged).toHaveBeenCalledWith(
        auth,
        expect.any(Function)
      );
      expect(mockCallback).toHaveBeenCalledWith(null);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it("debería permitir desuscribirse correctamente", async () => {
      const mockUnsubscribe = jest.fn();
      const mockCallback = jest.fn();

      onAuthStateChanged.mockImplementation((auth, callback) => {
        return mockUnsubscribe;
      });

      const unsubscribe = await Auth.subscribeToAuthState(mockCallback);
      unsubscribe();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe("getUserRole", () => {
    it("debería obtener el rol de usuario existente", async () => {
      const mockUid = "user-1";
      const mockRole = "Admin";

      ref.mockReturnValue("userRolesRef");
      child.mockReturnValue("userRoleRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => mockRole,
      });

      const result = await Auth.getUserRole(mockUid);

      expect(ref).toHaveBeenCalledWith(db, "userRoles");
      expect(child).toHaveBeenCalledWith("userRolesRef", mockUid);
      expect(result).toBe(mockRole);
    });

    it("debería retornar 'User' para usuario sin rol asignado", async () => {
      const mockUid = "user-2";

      ref.mockReturnValue("userRolesRef");
      child.mockReturnValue("userRoleRef");
      get.mockResolvedValue({
        exists: () => false,
      });

      const result = await Auth.getUserRole(mockUid);

      expect(result).toBe("User");
    });
  });

  describe("getUser", () => {
    it("debería obtener datos de usuario por cédula", async () => {
      const mockCedula = "123456789";
      const mockUserData = {
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "12345678",
        enabled: true,
      };

      ref.mockReturnValue("userRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => mockUserData,
      });
      const setUserMock = jest.fn();
      await Auth.getUser(mockCedula, setUserMock);

      expect(ref).toHaveBeenCalledWith(db, `users/${mockCedula}`);
      expect(setUserMock).toHaveBeenCalledWith(mockUserData);
    });

    it("debería manejar usuario no encontrado", async () => {
      const mockCedula = "nonexistent";

      ref.mockReturnValue("userRef");
      get.mockResolvedValue({
        exists: () => false,
      });

      const setUserMock = jest.fn();
      await Auth.getUser(mockCedula, setUserMock);

      expect(ref).toHaveBeenCalledWith(db, `users/${mockCedula}`);
      expect(setUserMock).toHaveBeenCalledWith(null);
    });
  });

  describe("resetPassword", () => {
    it("debería enviar email de restablecimiento de contraseña", async () => {
      const mockEmail = "test@example.com";
      sendPasswordResetEmail.mockResolvedValue();

      await Auth.resetPassword(mockEmail);

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, mockEmail);
    });

    it("debería manejar error al enviar email de restablecimiento", async () => {
      const mockEmail = "invalid@example.com";
      sendPasswordResetEmail.mockRejectedValue(new Error("auth/invalid-email"));

      await expect(Auth.resetPassword(mockEmail)).rejects.toThrow(
        "auth/invalid-email"
      );
    });
  });

  describe("deleteAccount", () => {
    it("debería eliminar cuenta de usuario exitosamente", async () => {
      const mockUid = "user-1";
      const mockCedula = "123456789";

      // Mock para obtener cédula
      ref.mockImplementation((db, path) => {
        if (path === `uidToCedula/${mockUid}`) return "uidMapRef";
        if (path === `users/${mockCedula}/enabled`) return "userRef";
        if (path === `userRoles/${mockUid}`) return "userRoleRef";
        return "unknownRef";
      });

      get.mockResolvedValue({
        exists: () => true,
        val: () => mockCedula,
      });

      set.mockResolvedValue();
      auth.currentUser.delete.mockResolvedValue();

      const result = await Auth.deleteAccount(mockUid);

      expect(auth.currentUser.delete).toHaveBeenCalled();
      expect(ref).toHaveBeenCalledWith(db, `uidToCedula/${mockUid}`);
      expect(ref).toHaveBeenCalledWith(db, `users/${mockCedula}/enabled`);
      expect(ref).toHaveBeenCalledWith(db, `userRoles/${mockUid}`);
      expect(set).toHaveBeenCalledWith("userRef", false);
      expect(set).toHaveBeenCalledWith("userRoleRef", null);
      expect(result).toBe(true);
    });

    it("debería manejar usuario no encontrado al eliminar cuenta", async () => {
      const mockUid = "nonexistent";

      auth.currentUser.delete.mockResolvedValue();
      ref.mockReturnValue("uidMapRef");
      get.mockResolvedValue({
        exists: () => false,
      });

      await expect(Auth.deleteAccount(mockUid)).rejects.toThrow(
        "Usuario no encontrado"
      );
    });

    it("debería manejar error al eliminar cuenta", async () => {
      const mockUid = "user-1";
      auth.currentUser.delete.mockRejectedValue(
        new Error("Error al eliminar cuenta")
      );

      await expect(Auth.deleteAccount(mockUid)).rejects.toThrow(
        "Error al eliminar cuenta"
      );
    });
  });

  describe("getCedulaByUserId", () => {
    it("debería obtener cédula por ID de usuario", async () => {
      const mockUserId = "user-1";
      const mockCedula = "123456789";

      ref.mockReturnValue("uidMapRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => mockCedula,
      });

      const result = await Auth.getCedulaByUserId(mockUserId);

      expect(ref).toHaveBeenCalledWith(db, `uidToCedula/${mockUserId}`);
      expect(result).toBe(mockCedula);
    });

    it("debería manejar usuario no encontrado", async () => {
      const mockUserId = "nonexistent";

      ref.mockReturnValue("uidMapRef");
      get.mockResolvedValue({
        exists: () => false,
      });

      await expect(Auth.getCedulaByUserId(mockUserId)).rejects.toThrow(
        "Usuario no encontrado"
      );
    });

    it("debería manejar usuario sin cédula registrada", async () => {
      const mockUserId = "user-2";

      ref.mockReturnValue("uidMapRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => null,
      });

      await expect(Auth.getCedulaByUserId(mockUserId)).rejects.toThrow(
        "Usuario no tiene cédula registrada"
      );
    });
  });

  describe("getUserData", () => {
    it("debería obtener datos del usuario por ID", async () => {
      const mockUserId = "user-1";
      const mockUserData = {
        name: "Juan Pérez",
        email: "juan@example.com",
        phone: "12345678",
        uid: "user-1",
        profileUrl: "https://example.com/profile.jpg",
        createdAt: "2024-01-01T00:00:00.000Z",
        enabled: true,
      };
      const mockCedula = "123456789";

      ref.mockReturnValueOnce("uidToCedulaRef");
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockCedula,
      });
      ref.mockReturnValue("userRef");
      get.mockResolvedValue({
        exists: () => true,
        val: () => mockUserData,
      });

      const result = await Auth.getUserData(mockUserId);
      expect(ref).toHaveBeenNthCalledWith(1, db, `uidToCedula/${mockUserId}`);
      expect(ref).toHaveBeenNthCalledWith(2, db, `users/${mockCedula}`);
      expect(get).toHaveBeenNthCalledWith(1, "uidToCedulaRef");
      expect(get).toHaveBeenNthCalledWith(2, "userRef");
      expect(result).toEqual({ ...mockUserData, id: mockCedula });
    });

    it("debería manejar usuario no encontrado", async () => {
      const mockUserId = "nonexistent";

      ref.mockReturnValue("userRef");
      get.mockResolvedValue({
        exists: () => false,
      });

      await expect(Auth.getUserData(mockUserId)).rejects.toThrow(
        "Usuario no encontrado"
      );
    });

    it("debería manejar error en la obtención de datos", async () => {
      const mockUserId = "user-1";

      ref.mockReturnValue("userRef");
      get.mockRejectedValue(new Error("Error de base de datos"));

      await expect(Auth.getUserData(mockUserId)).rejects.toThrow(
        "Error de base de datos"
      );
    });
  });

  describe("updateUserProfile", () => {
    it("debería actualizar el perfil del usuario exitosamente", async () => {
      const mockUserId = "user-1";
      const mockCedula = "123456789";
      const mockUpdates = {
        name: "Juan Pérez Actualizado",
        phone: "87654321",
        profileUrl: "https://example.com/new-profile.jpg",
        activities: {
          activity1: true,
          activity2: false,
        },
        comments: {
          comment1: { entityType: "posts", entityId: "post-1" },
          comment2: { entityType: "events", entityId: "event-1" },
        },
        email: "juan@example.com",
        id: mockCedula,
      };

      // Mock for retrieving cedula
      ref.mockReturnValueOnce("uidToCedulaRef");
      get.mockResolvedValueOnce({
        exists: () => true,
        val: () => mockCedula,
      });

      // Mock for update call
      update.mockResolvedValue();

      await Auth.updateUserProfile(mockUserId, mockUpdates);

      // Check calls to ref and get
      expect(ref).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        `uidToCedula/${mockUserId}`
      );
      expect(get).toHaveBeenCalledWith("uidToCedulaRef");

      // Check updates object passed to update
      const expectedUpdates = {
        [`users/${mockCedula}/email`]: mockUpdates.email,
        [`users/${mockCedula}/phone`]: mockUpdates.phone,
        [`users/${mockCedula}/name`]: mockUpdates.name,
        [`users/${mockCedula}/profileUrl`]: mockUpdates.profileUrl,
        [`users/${mockCedula}/updatedAt`]: mockDate, // ISO timestamp

        [`activities/activity1/registeredUsers/${mockCedula}/email`]:
          mockUpdates.email,
        [`activities/activity1/registeredUsers/${mockCedula}/phone`]:
          mockUpdates.phone,
        [`activities/activity1/registeredUsers/${mockCedula}/name`]:
          mockUpdates.name,

        [`comments/posts/post-1/comment1/author`]: mockUpdates.name,
        [`comments/posts/post-1/comment1/authorAvatar`]: mockUpdates.profileUrl,

        [`comments/events/event-1/comment2/author`]: mockUpdates.name,
        [`comments/events/event-1/comment2/authorAvatar`]:
          mockUpdates.profileUrl,
      };

      expect(update).toHaveBeenCalledWith(expect.anything(), expectedUpdates);
    });

    it("debería manejar usuario no encontrado", async () => {
      const mockUserId = "user-2";

      ref.mockReturnValueOnce("uidToCedulaRef");
      get.mockResolvedValueOnce({ exists: () => false });

      await expect(Auth.updateUserProfile(mockUserId, {})).rejects.toThrow(
        "Usuario no encontrado"
      );

      expect(get).toHaveBeenCalledWith("uidToCedulaRef");
      expect(update).not.toHaveBeenCalled();
    });

    it("debería manejar error en la actualización", async () => {
      const mockUserId = "user-4";
      const mockCedula = "1122334455";
      const mockUpdates = {
        name: "John Doe",
        phone: "12345678",
      };

      ref.mockReturnValueOnce("uidToCedulaRef");
      get.mockResolvedValueOnce({ exists: () => true, val: () => mockCedula });

      update.mockRejectedValueOnce(new Error("Database update failed"));

      await expect(
        Auth.updateUserProfile(mockUserId, mockUpdates)
      ).rejects.toThrow("Database update failed");

      expect(update).toHaveBeenCalled();
    });
  });
});
