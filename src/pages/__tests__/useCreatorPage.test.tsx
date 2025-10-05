import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Make tests isolated: mock the seeded data and toast library
jest.mock('../../data/data.json', () => ({
  id: 'seed-map',
  name: 'seed',
  venueId: 1,
  venueName: 'test',
  blockId: 1,
  blockName: 'general',
  stageText: 'STAGE',
  seatMapData: [
    { id: 's1', row: 'A', label: '1', type: 'seat' },
    { id: 's2', row: 'A', label: '2', type: 'seat' },
  ],
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

// The hook under test (import after mocks so it picks up mocked modules)
import useCreatorPage from '../useCreatorPage';

/**
 * Test component that exposes a few values from the hook so tests can assert
 * behavior without relying on internal implementation details.
 */
const TestComponent: React.FC = () => {
  const api = useCreatorPage();

  return (
    <div>
      <div data-testid="loading">{api.loading ? 'loading' : 'ready'}</div>
      <div data-testid="rows">{api.rows.length}</div>
      <button data-testid="add-empty" onClick={() => api.addEmptyRow()}>
        Add empty
      </button>
    </div>
  );
};

describe('useCreatorPage (isolated unit)', () => {
  beforeEach(() => {
    // clear Jest module cache to ensure mocks are applied freshly
    jest.resetModules();
  });

  test('loads initial data and exposes rows', async () => {
    render(<TestComponent />);

    // Wait until loading becomes ready
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    const rows = screen.getByTestId('rows');

    // There should be the 1 seeded row 'A'
    expect(Number(rows.textContent || '0')).toBe(1);
  });

  test('addEmptyRow increases row count', async () => {
    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    const rows = screen.getByTestId('rows');
    const before = Number(rows.textContent || '0');

    fireEvent.click(screen.getByTestId('add-empty'));

    // after clicking, the rows count should increase by 1
    await waitFor(() => expect(Number(rows.textContent || '0')).toBe(before + 1));
  });
});
