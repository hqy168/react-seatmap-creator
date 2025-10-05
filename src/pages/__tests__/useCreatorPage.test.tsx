import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// The hook under test
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

describe('useCreatorPage (smoke + simple actions)', () => {
  test('loads initial data and exposes rows', async () => {
    render(<TestComponent />);

    // Wait until loading becomes ready
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('ready'));

    const rows = screen.getByTestId('rows');

    // There should be at least one row from the seeded data
    expect(Number(rows.textContent || '0')).toBeGreaterThan(0);
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
