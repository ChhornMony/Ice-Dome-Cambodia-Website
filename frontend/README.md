# Ice Dome Cambodia - Next.js Fixed Version

This version has been cleaned for Next.js App Router.

## What was fixed

- Removed the `src/pages` routing conflict by moving old React page components to `src/views`.
- Kept Next.js routes inside `src/app`.
- Kept `CartProvider` wrapping the full app through `src/app/providers.jsx`.
- Updated route imports from `@/pages/...` to `@/views/...`.

## Run the project

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:3000
```

If port 3000 is busy, Next.js will use 3001 or another port.
