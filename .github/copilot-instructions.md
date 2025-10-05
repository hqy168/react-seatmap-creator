## Purpose

Short, focused guidance for AI coding agents working on this repo so they can be immediately productive.

## Quick summary (big picture)

- Single-page React + TypeScript app for creating and previewing seat maps.
- UI is componentized under `src/components/`; the main page is `src/pages/CreatorPage.tsx` which wires the UI to the state hook `src/pages/useCreatorPage.ts`.
- `src/data/data.json` is the seeded seat map used on app load. State is kept in-memory (no backend).

## Key systems and data flow

- State hub: `useCreatorPage.ts` – this file loads `data.json`, groups seats by `row` into a `Map<string, ISeat[]>` (`seatData`) and exposes all mutations (add, edit, delete, reorder, save).
- Presentation: `CreatorPage.tsx` consumes the `rows` (Array of entries from the Map) and renders each row as a `Draggable` with seats as children.
- Preview mode: `Preview.tsx` reuses the same `seatData` but renders non-interactive `SelectSeat` components inside `MapInteractionCSS` for pan/zoom.
- Drag and drop: Uses `@hello-pangea/dnd`. Rows are draggable by their row key string (the row string is used as `draggableId`). Reordering builds a new Map preserving the new order.

## Purpose

Short, focused guidance for AI coding agents working on this repo so they can be immediately productive.

## Quick summary (big picture)

- Single-page React + TypeScript app for creating and previewing seat maps.
- UI is componentized under `src/components/`; the main page is `src/pages/CreatorPage.tsx` which wires the UI to the state hook `src/pages/useCreatorPage.ts`.
- `src/data/data.json` is the seeded seat map used on app load. State is kept in-memory (no backend).

## Key systems and data flow

- State hub: `useCreatorPage.ts` – this file loads `data.json`, groups seats by `row` into a `Map<string, ISeat[]>` (`seatData`) and exposes all mutations (add, edit, delete, reorder, save).
- Presentation: `CreatorPage.tsx` consumes the `rows` (Array of entries from the Map) and renders each row as a `Draggable` with seats as children.
- Preview mode: `Preview.tsx` reuses the same `seatData` but renders non-interactive `SelectSeat` components inside `MapInteractionCSS` for pan/zoom.
- Drag and drop: Uses `@hello-pangea/dnd`. Rows are draggable by their row key string (the row string is used as `draggableId`). Reordering builds a new Map preserving the new order.

## Important types and conventions

- `src/types/types.ts` — visible types:
  - `ISeatMap` (meta + `seatMapData?: ISeat[]`)
  - `ISeat` { id, row, type, label }
  - `ISeatType` = 'seat' | 'space'
  - `IDirection` = 'left' | 'right'
- `seatData` is a Map keyed by the row string. Use `new Map(...)` when updating to ensure immutability and re-renders.
- Empty rows: row keys that begin with `empty-<id>` represent placeholder/empty rows (created by `addEmptyRow`).
- Spaces: seats of type `space` carry label `'0'`. Seat labels for real seats are short strings (usually numbers) and must be unique within a row — `editSeatName` enforces this.

## Files you will read or edit first

- `src/pages/useCreatorPage.ts` — single source of truth for all seat map business logic and the best place to implement mutation logic.
- `src/pages/CreatorPage.tsx` — how rows/seats are rendered and which props are passed to components like `Row`, `Seat`, `NewRow`, `NewSeat`.
- `src/components/Row.tsx`, `src/components/Seat.tsx`, `src/components/Preview.tsx` — UI patterns (context menu on right-click, dropdown forms, drag handle props).
- `src/data/data.json` — sample data that `useCreatorPage` reads on first load. Edits here change the seeded map.

## Scripts and developer workflows

- Install: `npm install` (or `yarn`)
- Dev server: `npm start` — runs the CRA dev server on localhost:3000
- Build: `npm run build` — note: package.json uses a Windows-style env command `set "GENERATE_SOURCEMAP=false" && react-scripts build`. On macOS/Linux prefer:

  GENERATE_SOURCEMAP=false npm run build

  or change the script to use `cross-env`.
- Lint/format: `npm run eslint`, `npm run prettier` and `npm run "prettier fix"`.
- There are no automated tests in the repo; add tests under a `__tests__` or `src/__tests__` folder if needed and wire up a test runner.

## Common gotchas and repository-specific tips

- Always update `seatData` immutably. Many helper functions in `useCreatorPage` clone Maps and arrays prior to mutation — follow that pattern to avoid subtle React update issues.
- Row ordering is significant: rows are ordered by the sequence of keys in the Map; reordering must produce a new Map with keys in the desired order.
- `Draggable` uses the row string as `draggableId` (see `CreatorPage.tsx`) — modifying how rows are identified may require changing drag logic.
- Right-click / context menus: components prevent default on `onContextMenu` and implement their own dropdowns; be careful when changing event handling.
- When adding seats programmatically: seat `id` is created with `uuid.v4()` and `label` for spaces is `'0'`. For seats the label generation logic attempts to find the max numeric seat label in the row and increment it — preserve this logic if you want consistent labels.
- `saveData` currently prints the merged `ISeatMap` to console (no backend). If you wire a backend, update this function in `useCreatorPage`.

## Integration points / dependencies

- Drag and drop: `@hello-pangea/dnd` — row-level reordering only.
- Tooling/UX: `react-tooltip`, `react-hot-toast` (toasts used across `useCreatorPage`), `react-map-interaction` (preview pan/zoom).
- UUID generation: `uuid` v4 used in `useCreatorPage`.

## Example quick edits (concrete)

- To add server save: edit `saveData` in `src/pages/useCreatorPage.ts` — it already produces a merged `ISeatMap` object via `Array.from(seatData.values()).flat()`.
- To add a validation that row names are upper-case: update `addSeatedRow` / `editRowName` (they already normalize case for duplicate checks).

## If you're unclear

- Start by running `npm start` and open `http://localhost:3000` so you can see UI behavior while changing `useCreatorPage.ts`.
- If anything in the UI is surprising, search for the function in `useCreatorPage.ts` — most UI actions invoke a single function exported from that hook.

---

## Examples (copyable)

- Safe Map update pattern (preserves immutability and order):

```ts
// inside useCreatorPage or similar
setSeatData((prev) => {
  const next = new Map(prev); // shallow copy of Map

  // modify a row immutably
  const seats = next.get('A') ?? [];
  next.set('A', seats.map(s => s.id === targetId ? { ...s, label: 'X' } : s));

  return next;
});
```

- Minimal `saveData` example to POST merged map to a backend (replace URL):

```ts
const saveData = async (): Promise<void> => {
  const merged = Array.from(seatData.values()).flat();
  const payload = { ...seatMap!, seatMapData: merged };

  try {
    const res = await fetch('https://api.example.com/seatmaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());

    toast.success('Saved to server');
  } catch (err) {
    toast.error('Save failed');
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
```

If you want, I can iterate on this file to include small code snippets (examples of safe Map updates) or add a checklist for common PR changes. Feedback welcome.
