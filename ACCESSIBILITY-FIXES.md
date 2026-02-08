# Quick Accessibility Fix Guide

This is a condensed action list extracted from the full WCAG audit report. See `WCAG-AUDIT-REPORT.md` for complete details.

---

## Critical Issues (Fix Immediately)

### 1. Missing Skip Navigation Link
**File**: `src/layouts/BaseLayout.astro`  
**Line**: After 107 (before `<Navigation />`)

```astro
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header class="site-header" transition:persist>
    <Navigation />
  </header>
  <main id="main-content">
    <slot />
  </main>
  <Footer />
</body>

<style>
  /* Add to existing <style> block */
  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    padding: var(--space-md) var(--space-lg);
    background: var(--color-accent);
    color: var(--color-bg);
    text-decoration: none;
    z-index: 1000;
    font-weight: 600;
  }
  
  .skip-link:focus {
    left: var(--space-md);
    top: var(--space-md);
  }
</style>
```

### 2. Fix Color Contrast for `--color-text-muted`
**File**: `src/styles/global.css`  
**Lines**: 11 (dark mode), 89 (light mode)

**Dark Mode** (line 11):
```css
/* OLD: --color-text-muted: #6b8a96; (3.42:1 - FAILS) */
--color-text-muted: #7eb5c2; /* NEW: ~4.6:1 - PASSES */
```

**Light Mode** (line 89):
```css
/* OLD: --color-text-muted: #6b8a96; (3.36:1 - FAILS) */
--color-text-muted: #506873; /* NEW: ~4.7:1 - PASSES */
```

### 3. Avoid `--color-text-muted` on Elevated Backgrounds
**Guidance**: Use `--color-text-secondary` instead when text appears on `--color-bg-elevated` to ensure 4.5:1+ contrast.

---

## Major Issues (Fix Soon)

### 4. Add `aria-hidden="true"` to Decorative SVGs

**File**: `src/components/BackLink.astro`, line 33
```astro
<svg class="back-icon" aria-hidden="true" width="16" height="16" ...>
```

**File**: `src/components/ArrowLink.astro`, lines 48 and 52
```astro
<svg class="arrow-icon" aria-hidden="true" width="16" height="16" ...>
```

### 5. Fix Navigation Brand Label
**File**: `src/components/Navigation.astro`, line 21

```astro
<!-- OLD: aria-label={siteConfig.author.name} -->
<a href="/" class="nav-brand" aria-label="Home">
```

### 6. Ensure Touch Target Sizes

**File**: `src/components/ThemeToggle.astro`, lines 52-54
```css
.theme-toggle {
  /* OLD: width: 36px; height: 36px; */
  width: 44px;
  height: 44px;
  /* ... rest stays same */
}
```

**File**: `src/pages/index.astro`, add to `.btn-primary` and `.btn-secondary`
```css
.btn-primary,
.btn-secondary {
  /* ... existing styles ... */
  min-height: 44px;  /* NEW */
  min-width: 44px;   /* NEW */
}
```

---

## Minor Issues (Nice to Have)

### 7. Add `prefers-reduced-motion` Support
**File**: `src/styles/global.css`, add at end (after line 203)

```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 8. Add Explicit Focus Indicators

**File**: `src/components/TimelineEntry.astro`, add after line 314
```css
.expand-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--border-radius-sm);
}
```

**File**: `src/styles/utilities.css`, add after line 97
```css
.sort-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**File**: `src/pages/index.astro`, add to style block
```css
.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**File**: `src/components/Navigation.astro`, add after line 95
```css
.nav-brand:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
  border-radius: var(--border-radius-sm);
}
```

---

## Testing Checklist

After making fixes:

- [ ] Test skip link with Tab key on first page load
- [ ] Verify all muted text is readable in both dark and light modes
- [ ] Test all buttons with keyboard (Tab + Enter/Space)
- [ ] Check focus indicators are visible on all interactive elements
- [ ] Test on mobile device for touch target sizes
- [ ] Enable "Reduce motion" in OS and verify animations stop
- [ ] Run automated accessibility checker (axe DevTools, Lighthouse)
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)

---

## Quick Color Contrast Reference

### Passing Combinations (4.5:1+)
✓ `--color-text` on any background (16.42:1+)  
✓ `--color-text-secondary` on any background (4.64:1+)  
✓ `--color-accent` on any background (4.64:1+)  

### After Fixes
✓ `--color-text-muted` (NEW values) on any background (4.6:1+)

### Avoid
✗ OLD `--color-text-muted` (#6b8a96) on `--color-bg-content` or `--color-bg-elevated`

---

**Estimated Total Fix Time**: 45-60 minutes  
**Impact**: Brings site to WCAG 2.2 Level AA compliance
