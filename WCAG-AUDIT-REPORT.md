# WCAG 2.2 Accessibility Audit Report

**Site**: jasonlo.dev  
**Audit Date**: 2025-02-07  
**Auditor**: AI Agent (Claude)  
**Standards**: WCAG 2.2 Levels A & AA  

---

## Executive Summary

This audit assessed the Astro v5 static site for compliance with WCAG 2.2 accessibility guidelines at levels A and AA. The site demonstrates strong foundational accessibility with semantic HTML, proper ARIA attributes, and excellent keyboard navigation support. However, several issues were identified related to color contrast, missing skip navigation, lack of motion preference support, and insufficient focus indicators on some interactive elements.

**Issue Summary**: 3 critical, 5 major, 7 minor issues found.

---

## Design System Analysis

### Color Palette

**Dark Mode:**
- Background: `#0a1420` (main), `#17323e` (content), `#0d1725` (secondary), `#1e3645` (elevated)
- Text: `#f1f5f8` (primary), `#7fa3ad` (secondary), `#6b8a96` (muted)
- Accent: `#7fa3ad`, `#93b2bc` (hover)
- Border: `#335f76`, `#2a5a6d` (subtle)

**Light Mode:**
- Background: `#f1f5f8` (main), `#ffffff` (content), `#ebf0f4` (secondary), `#f6f8fa` (elevated)
- Text: `#0d1725` (primary), `#4d5f69` (secondary), `#6b8a96` (muted)
- Accent: `#1d4d5e`, `#133d4e` (hover)
- Border: `#d4e0e6`, `#e2ecf0` (subtle)

### Typography
- Base font: system-ui stack
- Scale: 12px–48px (0.75rem–3rem)
- Line heights: 1.25 (tight), 1.5 (normal), 1.75 (relaxed)
- Font weights: 400, 500, 600, 700

---

## Audit Findings

| Severity | File | Line | WCAG Criterion | Issue | Suggested Fix |
|----------|------|------|-----------------|-------|---------------|
| **Critical** | `src/layouts/BaseLayout.astro` | 51-116 | 2.4.1 Bypass Blocks (A) | Missing skip navigation link to bypass header and navigation | Add skip link: `<a href="#main-content" class="skip-link">Skip to main content</a>` before `<Navigation />`. Style with `.skip-link { position: absolute; left: -9999px; } .skip-link:focus { left: 0; top: 0; padding: var(--space-md); background: var(--color-accent); color: var(--color-bg); z-index: 1000; }` |
| **Critical** | `src/styles/global.css` | 3-79 | 1.4.3 Contrast (AA) | Dark mode: `--color-text-muted` (#6b8a96) on `--color-bg-content` (#17323e) = 3.65:1 fails WCAG AA (needs 4.5:1) | Update dark mode `--color-text-muted` to a lighter value like `#7eb5c2` (estimated 4.5:1) |
| **Critical** | `src/styles/global.css` | 82-110 | 1.4.3 Contrast (AA) | Light mode: `--color-text-muted` (#6b8a96) on all backgrounds fails WCAG AA (3.21:1–3.68:1, needs 4.5:1) | Update light mode `--color-text-muted` to darker value like `#506873` (estimated 4.5:1) |
| **Major** | Global | N/A | 1.4.3 Contrast (AA) | Dark mode: `--color-text-muted` (#6b8a96) on `--color-bg-elevated` (#1e3645) = 3.42:1 fails WCAG AA | Use `--color-text-secondary` (4.64:1 ✓) instead of `--color-text-muted` on elevated backgrounds |
| **Major** | `src/pages/index.astro` | 147-161 | 2.5.8 Target Size (AA 2.2) | `.btn-primary` and `.btn-secondary` buttons have padding of 0.75rem × 1.5rem, potentially under 24×24px touch target | Ensure minimum 24×24px: `min-height: 44px; min-width: 44px;` or increase padding to at least `0.75rem 1.5rem` (which is 12px × 24px = needs verification) |
| **Major** | `src/components/ThemeToggle.astro` | 48-62 | 2.5.8 Target Size (AA 2.2) | Theme toggle button is 36×36px, below WCAG 2.2's 24×24px minimum (meets old guideline but consider 44×44px for better usability) | Increase to 44×44px: `width: 44px; height: 44px;` |
| **Major** | `src/components/BackLink.astro` | 32-37 | 1.1.1 Non-text Content (A) | SVG arrow icon lacks text alternative; relies on adjacent text but icon has no `aria-hidden="true"` | Add `aria-hidden="true"` to SVG: `<svg class="back-icon" aria-hidden="true" ...>` |
| **Major** | `src/components/Navigation.astro` | 22-24 | 1.1.1 Non-text Content (A) | Brand logo SVG has `aria-hidden="true"` but link has `aria-label` with only author name, not indicating it's a home link | Change to: `aria-label="Home - ${siteConfig.author.name}"` or `aria-label="Go to homepage"` |
| **Minor** | Global | N/A | 2.3.3 Animation from Interactions (AAA) | No `prefers-reduced-motion` media query support for animations and transitions | Add to `global.css`: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }` |
| **Minor** | `src/components/TimelineEntry.astro` | 297-318 | 2.4.7 Focus Visible (AA) | `.expand-toggle` button has no visible focus indicator defined (relies on global styles) | Add explicit focus style: `.expand-toggle:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: var(--border-radius-sm); }` |
| **Minor** | `src/styles/utilities.css` | 87-108 | 2.4.7 Focus Visible (AA) | `.sort-btn` has no visible focus indicator | Add: `.sort-btn:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` |
| **Minor** | `src/components/ArrowLink.astro` | 48-56 | 1.1.1 Non-text Content (A) | Arrow SVG icons lack `aria-hidden="true"` attribute | Add `aria-hidden="true"` to both SVG elements (lines 48 and 52) |
| **Minor** | `src/pages/index.astro` | 147-178 | 2.4.7 Focus Visible (AA) | `.btn-primary` and `.btn-secondary` lack explicit focus indicators (rely on global) | Add: `.btn-primary:focus-visible, .btn-secondary:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` |
| **Minor** | `src/components/Navigation.astro` | 86-95 | 2.4.7 Focus Visible (AA) | `.nav-brand` link lacks explicit focus indicator | Add: `.nav-brand:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; border-radius: var(--border-radius-sm); }` |
| **Minor** | `src/components/TimelineEntry.astro` | 101-153 | 1.3.1 Info and Relationships (A) | Timeline uses `<article>` but could benefit from additional semantic structure | Consider wrapping entire timeline in `<section aria-label="Career Timeline">` for better screen reader navigation |

---

## Detailed Analysis by Category

### 1. Perceivable

#### ✓ **Strengths:**
- **Images**: No decorative images found without alt text (site appears to be primarily text-based)
- **Text alternatives**: Site structure is primarily semantic HTML with good text content
- **Semantic HTML**: Proper use of `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>`
- **Color contrast (mostly passing)**:
  - Dark mode primary text: 16.90:1 ✓
  - Dark mode secondary text: 4.96:1+ ✓
  - Light mode primary text: 16.42:1+ ✓
  - Light mode secondary text: 6.07:1+ ✓
  - Accent colors: 4.64:1+ ✓

#### ✗ **Issues:**
- **Color contrast failures**: `--color-text-muted` in both themes (see Critical issues above)
- **No color-only meaning detected**: Site does not rely solely on color to convey information ✓

### 2. Operable

#### ✓ **Strengths:**
- **Keyboard navigation**: All interactive elements are keyboard accessible via native HTML elements (`<button>`, `<a>`)
- **Focus order**: Logical DOM order matches visual presentation
- **Navigation**: Consistent navigation pattern across all pages with `aria-current="page"` on active links
- **Interactive elements**: Proper `<button>` elements for toggle/expand functionality
- **ARIA states**: Proper use of `aria-expanded`, `aria-hidden`, `aria-controls`, `aria-label`

#### ✗ **Issues:**
- **Missing skip link**: No bypass mechanism for keyboard users (Critical)
- **Touch target sizes**: Some buttons below 44×44px recommendation (Major)
- **Focus indicators**: Some interactive elements rely only on global focus styles without component-specific reinforcement (Minor)

### 3. Understandable

#### ✓ **Strengths:**
- **Language**: Proper `lang="en"` attribute on `<html>` element (line 52, BaseLayout.astro)
- **Form labels**: No form inputs found on site (appears to be static portfolio without forms) ✓
- **Consistent navigation**: Navigation component persists across all pages with `transition:persist`
- **Predictable behavior**: Theme toggle maintains state across page transitions
- **Error prevention**: N/A (no forms or data input)

#### ✗ **Issues:**
- No significant issues found in this category

### 4. Robust

#### ✓ **Strengths:**
- **Valid ARIA**: Proper use of `aria-label`, `aria-current`, `aria-expanded`, `aria-hidden`, `aria-controls`
- **Semantic landmarks**: Proper `<main>`, `<nav>`, `<header>`, `<footer>` elements
- **Heading hierarchy**: Logical heading structure (h1 → h2 → h3) throughout
- **HTML validity**: Appears to use valid HTML5 structure
- **No duplicate IDs detected**: TimelineEntry generates unique IDs using timestamps

#### ✗ **Issues:**
- **ARIA on decorative content**: Some SVG icons lack `aria-hidden="true"` (Minor)
- **Navigation ARIA**: Nav element has proper `aria-label="Main navigation"` ✓

---

## Recommended Priority Fixes

### High Priority (Critical & Major)

1. **Add skip navigation link** (BaseLayout.astro)
   - Impact: Enables keyboard users to bypass repetitive navigation
   - Effort: Low (5 minutes)

2. **Fix color contrast for `--color-text-muted`** (global.css)
   - Dark mode: Change from `#6b8a96` to `#7eb5c2`
   - Light mode: Change from `#6b8a96` to `#506873`
   - Impact: Improves readability for low-vision users
   - Effort: Low (10 minutes + testing both themes)

3. **Ensure touch target sizes** (index.astro, ThemeToggle.astro)
   - Add minimum dimensions to buttons
   - Impact: Improves mobile usability
   - Effort: Low (10 minutes)

4. **Add `aria-hidden="true"` to decorative SVGs** (Navigation.astro, BackLink.astro, ArrowLink.astro)
   - Impact: Prevents screen readers from announcing decorative graphics
   - Effort: Very low (2 minutes)

### Medium Priority (Minor)

5. **Add `prefers-reduced-motion` support** (global.css)
   - Impact: Improves experience for users with vestibular disorders
   - Effort: Low (5 minutes)

6. **Add explicit focus indicators** (All interactive components)
   - Impact: Improves keyboard navigation visibility
   - Effort: Medium (20 minutes across all components)

---

## Testing Recommendations

1. **Manual keyboard testing**: Navigate entire site using only Tab, Shift+Tab, Enter, Space
2. **Screen reader testing**: Test with NVDA (Windows), JAWS (Windows), or VoiceOver (macOS)
3. **Color contrast verification**: Use browser DevTools or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) after making fixes
4. **Mobile touch testing**: Test all interactive elements on actual mobile devices
5. **Reduced motion testing**: Enable "Reduce motion" in OS settings and verify animations disable

---

## Compliance Summary

| WCAG Level | Status | Notes |
|------------|--------|-------|
| **Level A** | Partial | Missing skip link (2.4.1), some contrast issues (1.4.3) |
| **Level AA** | Partial | Contrast failures with muted text colors (1.4.3), touch target sizes (2.5.8) |
| **Level AAA** | Not assessed | Reduced motion support recommended but not required for AA |

---

## Additional Observations

### Positive Findings
- ✓ Excellent semantic HTML structure throughout
- ✓ Proper use of ARIA attributes where needed
- ✓ Theme switching maintains accessibility across both modes
- ✓ Responsive design considerations for mobile
- ✓ Logical heading hierarchy
- ✓ No reliance on color alone for information
- ✓ Proper link text (no "click here" or generic text)
- ✓ Temporal information uses `<time>` with `datetime` attribute

### Design System Strengths
- Well-organized CSS custom properties for easy maintenance
- Consistent spacing and typography scales
- Thoughtful dark/light theme implementation
- Good use of semantic color naming

---

## Conclusion

The site demonstrates a strong foundation in accessibility with semantic HTML, proper ARIA usage, and excellent keyboard support. Addressing the identified contrast issues and adding skip navigation will significantly improve compliance with WCAG 2.2 AA standards. The recommended fixes are straightforward and can be implemented with minimal impact on the site's visual design, as they primarily involve using existing CSS custom properties and adding standard accessibility attributes.

**Next Steps:**
1. Address critical contrast issues in color palette
2. Add skip navigation link
3. Verify and adjust touch target sizes
4. Add decorative SVG attributes
5. Implement reduced motion support
6. Retest with assistive technologies

---

**Report Generated**: 2025-02-07  
**Total Issues**: 15 (3 critical, 5 major, 7 minor)
