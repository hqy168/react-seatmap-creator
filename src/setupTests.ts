// Global test setup file for jest (used by react-scripts)
// Optionally add other global test setup here (e.g., jest-dom)
import '@testing-library/jest-dom';
// Centralized manual mocks (located in src/__mocks__/)
// Mock react-hot-toast globally using the manual mock in src/__mocks__
jest.mock('react-hot-toast');

// Mock the data.json module globally for tests by pointing to the manual mock
jest.mock('./data/data.json', () => require('./__mocks__/data.json.js'));
