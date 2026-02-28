# Accessibility Audit (WCAG-Oriented)

Date: 2026-02-28

## Scope

- Templates in `src/app/**/*.html`
- Tokens and key color pairs in `src/styles/tokens`
- Dialog and keyboard-focus patterns in navbar + filters drawer

## Automated checks executed

1. Images with accessible alternative text
- Check: no `<img>` without `alt` or `[alt]`
- Result: Pass

2. Button explicit type
- Check: no `<button>` without `type`
- Result: Pass

3. Dialog semantics and focus anchors
- Check: presence of `role="dialog"`, `aria-modal`, `aria-labelledby`, skip-link target
- Result: Pass for mobile nav dialog, filters dialog, popover dialog, skip-link target in main content

4. Placeholder links
- Check: no `href="#"` links
- Result: Pass

5. Contrast ratios (key UI pairs)
- `#342e34` on `#ffffff`: 13.24 (AA normal Pass)
- `#622f60` on `#ffffff`: 10.02 (AA normal Pass)
- `#6b7d8d` on `#ffffff`: 4.25 (AA normal Fail, AA large Pass)
- `#ffffff` on `#622f60`: 10.02 (AA normal Pass)
- `#4e250e` on `#ff8f50`: 5.83 (AA normal Pass)
- `#31190c` on `#d67843`: 5.20 (AA normal Pass)
- `#342e34` on `#fbf6f4`: 12.35 (AA normal Pass)
- `#622f60` on `#fbf6f4`: 9.35 (AA normal Pass)

## Notes

- The support tone `#6b7d8d` only reaches AA for large text. In this project it is used for a large subtitle (`22px`), so it is acceptable there.
- Full runtime AXE scan still recommended in-browser as final QA gate.
