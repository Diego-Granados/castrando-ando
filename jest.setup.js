// Configuración global para las pruebas
global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
};
import "@testing-library/jest-dom";
const fetch = require("node-fetch");
global.Request = fetch.Request;
global.Response = fetch.Response;

// Add any global test setup here
global.fetch = jest.fn();

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  push: jest.fn(),
  remove: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    useDeviceLanguage: jest.fn(),
  })),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
}));
