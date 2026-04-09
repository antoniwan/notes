# Quickstart: Professional Mobile Navigation Refresh

## 1) Implement scope

Target files:

- `src/components/MobileNav.astro`
- `src/components/Header.astro`
- `src/components/Navigation.astro` (only if shared destination/hierarchy behavior needs sync)
- `src/data/navigation.ts` (only if destination labels/order need controlled updates)

## 2) Verify required behavior manually

Use a mobile viewport (or device emulator) and validate:

1. Hamburger trigger opens menu and updates ARIA expanded state.
2. Menu shows v1 destination set: Home, Posts, Brain Science, About, Search.
3. Brain Science appears with neutral emphasis and is not prioritized above Guided Path.
4. Close button, overlay tap, Escape key, and first Back action each dismiss menu correctly.
5. First Back closes menu without leaving current page.
6. Selecting any destination closes menu and navigates correctly.
7. Active destination is visibly indicated.
8. Focus enters menu on open and returns to trigger on close.

## 3) Run project quality gates

```bash
pnpm run lint
pnpm run check
pnpm run format:check
pnpm run build
```

## 4) Regression checks

- Desktop navigation remains unchanged at desktop breakpoints.
- Mobile search toggle in header still works with updated menu interactions.
- No body-scroll lock leak after repeated menu open/close cycles.
