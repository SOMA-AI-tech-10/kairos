# Code Style Convention

## General Rules

- Prefer the existing code style in the touched area.
- Keep changes narrowly scoped to the task.
- Do not refactor unrelated code.
- Add abstractions only when they remove real duplication or match an existing pattern.
- Update docs or specs when behavior changes.
- Prefer structured APIs and parsers over ad hoc string manipulation.

## Frontend

The frontend is an Expo React Native app under `frontend/app`.

Follow these rules for frontend changes:

- Keep source code under `frontend/app/src`.
- Prefer TypeScript types over implicit `any`.
- Keep components focused and easy to scan.
- Split large components before they become hard to review.
- Keep styling separate when a component's styles become non-trivial.
- Use existing navigation, constants, API, type, and utility patterns before adding new structure.
- Use `lucide-react-native` for icons when an appropriate icon exists.
- Avoid hard-coded user-facing strings in shared logic.
- Add or update tests for behavior that can regress.

Current frontend checks:

```bash
cd frontend/app
npm run typecheck
npm test
```

### Feature Structure

Use the existing `src` layout unless a feature clearly benefits from a feature-oriented split.

Current layout:

```text
src/
  api/
  components/
  constants/
  navigation/
  screens/
  types/
  utils/
```

When introducing a larger domain feature, prefer a feature-oriented structure:

```text
src/features/<feature>/
  api/
  model/
  ui/
```

Do not migrate existing code to a new architecture as part of an unrelated task.

## Backend

The backend is a FastAPI app under `backend`.

Follow these rules for backend changes:

- Keep route handlers thin.
- Put business logic in services.
- Keep request and response shapes in schemas.
- Avoid mixing database access, API parsing, and orchestration in the same function.
- Update `backend/README.md` when setup or runtime behavior changes.

Relevant backend layout:

```text
backend/app/
  routes/
  services/
  db.py
  main.py
  models.py
  schemas.py
```

## Verification

Run the most relevant checks for the changed area.

Frontend:

```bash
cd frontend/app
npm run typecheck
npm test
```

Backend:

```bash
cd backend
python -m compileall app
```

If a check is unavailable or cannot be run, report that explicitly.
