# MathSolve Frontend

Small React/Vite frontend for uploading math worksheets, reading extracted problems, and solving selected questions through a backend API.

## What It Does

- Sign in or create an account
- Upload worksheet files (`JPG`, `PNG`, `PDF`)
- Send worksheets to the backend for problem extraction
- Solve selected problems
- Review saved worksheet history, answers, steps, and explanations

## Run Locally

```bash
npm install
npm run dev
```

Set the backend URL before running:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

## Build

```bash
npm run build
```

## Main Files

- `src/App.tsx` - main app flow
- `src/api.ts` - backend API calls
- `src/types.ts` - response types
- `src/components/` - UI components
