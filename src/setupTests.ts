// Global test setup file for jest (used by react-scripts)
// Mock react-hot-toast globally so individual tests don't need to mock it.
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

// Optionally add other global test setup here (e.g., jest-dom)
import '@testing-library/jest-dom';
