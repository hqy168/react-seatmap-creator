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
    { id: 's3', row: 'B', label: '1', type: 'seat' },
  ],
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

// import the mocked toast to assert calls
import toast from 'react-hot-toast';

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
      <div data-testid='loading'>{api.loading ? 'loading' : 'ready'}</div>
      <div data-testid='rows'>{api.rows.length}</div>
      <div data-testid='row-keys'>{api.rows.map((r) => r[0]).join(',')}</div>

      <button data-testid='add-empty' onClick={() => api.addEmptyRow()}>
        Add empty
      </button>

      <button data-testid='rename-conflict' onClick={() => api.editSeatName('A', 's2', '1')}>
        Rename conflict
      </button>

      <button
        data-testid='reorder-rows'
        onClick={() =>
          api.handleOnDragEnd({
            source: { index: 0 },
            destination: { index: 1 },
          } as any)
        }
      >
        Reorder rows
      </button>

      <button data-testid='add-seated' onClick={() => api.addSeatedRow('A')}>
        Add seated
      </button>
    </div>
  );
};

describe('useCreatorPage (isolated unit)', () => {
  beforeEach(() => {
    // clear mock call history between tests
    jest.clearAllMocks();
  });

  test('loads initial data and exposes rows', async () => {
    render(<TestComponent />);

    // Wait until loading becomes ready
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    const rows = screen.getByTestId('rows');

  // There should be 2 seeded rows 'A' and 'B'
  expect(Number(rows.textContent || '0')).toBe(2);
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

  test('editSeatName conflict triggers toast and does not change labels', async () => {
    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    // attempt to rename seat s2 to label '1' (conflicts with s1)
    fireEvent.click(screen.getByTestId('rename-conflict'));

    // toast.error should be called
    expect(toast.error).toHaveBeenCalled();
  });

  test('handleOnDragEnd reorders rows', async () => {
    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    const keysBefore = screen.getByTestId('row-keys').textContent;

    // initial order should be 'A,B'
    expect(keysBefore).toBe('A,B');

    fireEvent.click(screen.getByTestId('reorder-rows'));

    // after reordering, keys should be 'B,A'
    await waitFor(() => expect(screen.getByTestId('row-keys').textContent).toBe('B,A'));
  });

  test('addSeatedRow rejects duplicate and triggers toast', async () => {
    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    const before = Number(screen.getByTestId('rows').textContent || '0');

    fireEvent.click(screen.getByTestId('add-seated'));

    // duplicate row name should trigger toast.error and rows should be unchanged
    expect(toast.error).toHaveBeenCalled();
    expect(Number(screen.getByTestId('rows').textContent || '0')).toBe(before);
  });
});
