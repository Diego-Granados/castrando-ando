// Configuración global para las pruebas
global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
};
