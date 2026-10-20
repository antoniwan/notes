import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

// prose-lg on the 4px rhythm. The typography plugin spaces long text in em (p 1.333em, h2 1.867em
// above). Here each of its vertical em values rounds to the nearest 4px, under the plugin's own
// selectors, so its "flush after a heading", first-child, and last-child rules keep working.
// Headings take a named line-height step (--leading-* in global.css).
const round4 = (em) => `round(nearest, ${em}em, 4px)`;
const block = (top, bottom = top) => ({ marginTop: round4(top), marginBottom: round4(bottom) });
const PROSE_LG_ROUNDED = {
  p: block(1.3333333),
  '[class~="lead"]': block(1.0909091),
  blockquote: block(1.6666667),
  h1: { marginBottom: round4(0.8333333) },
  h2: { ...block(1.8666667, 1.0666667), lineHeight: 'var(--leading-tight)' },
  h3: { ...block(1.6666667, 0.6666667), lineHeight: 'var(--leading-snug)' },
  h4: { ...block(1.7777778, 0.4444444), lineHeight: 'var(--leading-normal)' },
  img: block(1.7777778),
  picture: block(1.7777778),
  video: block(1.7777778),
  figure: block(1.7777778),
  figcaption: { marginTop: round4(1) },
  pre: { ...block(2), paddingTop: round4(1), paddingBottom: round4(1) },
  ol: block(1.3333333),
  ul: block(1.3333333),
  li: block(0.6666667),
  '> ul > li p': block(0.8888889),
  '> ul > li > p:first-child': { marginTop: round4(1.3333333) },
  '> ul > li > p:last-child': { marginBottom: round4(1.3333333) },
  '> ol > li > p:first-child': { marginTop: round4(1.3333333) },
  '> ol > li > p:last-child': { marginBottom: round4(1.3333333) },
  'ul ul, ul ol, ol ul, ol ol': block(0.8888889),
  dl: block(1.3333333),
  dt: { marginTop: round4(1.3333333) },
  dd: { marginTop: round4(0.6666667) },
  hr: block(3.1111111),
  'thead th': { lineHeight: 'var(--leading-normal)' },
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Electric marigold (Vastitas)
        primary: {
          50: '#FFF8E0',
          100: '#FFEFAB',
          200: '#FFE066',
          300: '#FFD12E',
          400: '#F8C000',
          500: '#F8B000',
          600: '#DC9400',
          700: '#B87400',
          800: '#8F5800',
          900: '#5C3800',
        },

        // UV violet (Vastitas reverse side)
        accent: {
          50: '#F3EDFF',
          100: '#E4D6FF',
          200: '#C9ADFF',
          300: '#A87AFF',
          400: '#8A52F0',
          500: '#5828A8',
          600: '#441C8C',
          700: '#351570',
          800: '#260F54',
          900: '#180838',
        },

        // Bright marigold selection wash
        highlight: {
          50: '#FFFBEA',
          100: '#FFF3C4',
          200: '#FFE68A',
          300: '#FFD64A',
          400: '#FFD640',
          500: '#FFC814',
          600: '#E0A800',
          700: '#B88600',
          800: '#8F6800',
          900: '#5C4200',
        },

        // Status colors (functional only — not brand)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#227846',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },

        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#8c6e1e',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        error: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#8c2828',
          600: '#737373',
          700: '#404040',
          800: '#262626',
          900: '#0a0a0a',
        },

        // Cool gray neutrals
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#0a0a0a',
        },

        // Background colors using CSS variables
        background: {
          DEFAULT: 'rgb(var(--color-bg))',
          alt: 'rgb(var(--color-bg-alt))',
        },

        // Text colors using CSS variables
        text: {
          DEFAULT: 'rgb(var(--color-text))',
          muted: 'rgb(var(--color-text-muted))',
        },

        // Border colors using CSS variables
        border: {
          DEFAULT: 'rgb(var(--color-border))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        heading: ['var(--font-heading)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        // The type scale. Every line height is a multiple of 4px (0.25rem): 14/24, 16/28, 18/32,
        // 20/36, 24/40, 30/40, 36/48, 44/52, 56/60, 72/72.
        xs: ['0.875rem', { lineHeight: '1.5rem', letterSpacing: '0.01em' }],
        sm: ['1rem', { lineHeight: '1.75rem', letterSpacing: '0.01em' }],
        base: ['1.125rem', { lineHeight: '2rem', letterSpacing: '0.01em' }],
        lg: ['1.25rem', { lineHeight: '2.25rem', letterSpacing: '0.01em' }],
        xl: ['1.5rem', { lineHeight: '2.5rem', letterSpacing: '0em' }],
        '2xl': ['1.875rem', { lineHeight: '2.5rem', letterSpacing: '-0.01em' }],
        '3xl': ['2.25rem', { lineHeight: '3rem', letterSpacing: '-0.01em' }],
        '4xl': ['2.75rem', { lineHeight: '3.25rem', letterSpacing: '-0.02em' }],
        '5xl': ['3.5rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em' }],
        '6xl': ['4.5rem', { lineHeight: '4.5rem', letterSpacing: '-0.03em' }],
      },
      spacing: {
        // Vertical rhythm system (named tokens — do NOT reuse sm/md/xl/2xl/3xl here;
        // in Tailwind v4 those keys also drive max-w-* and would crush max-w-3xl to 4rem)
        section: '4rem',
        block: '2rem',
        element: '1rem',
        content: '0.75rem',
        tight: '0.375rem',
      },
      maxWidth: {
        // Restore default reading widths (must be explicit after custom spacing history)
        xs: '20rem',
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',

        // Content widths. measure is the site's one reading width (--measure in global.css).
        measure: 'var(--measure)',
        aside: 'min(var(--size-aside), 100%)',
        prose: '65ch',
        'prose-wide': '85ch',

        // Layout containers
        container: '1400px',
        'container-narrow': '1024px',
        'container-wide': '1600px',

        // Component widths
        card: '400px',
        'card-wide': '600px',
        media: '100%',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '-0.011em',
        wide: '0.025em',
        wider: '0.05em',
      },
      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'rgb(var(--color-text))',
            a: {
              color: 'rgb(var(--color-accent))',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s ease',
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            code: {
              color: 'inherit',
              fontWeight: '400',
              backgroundColor: 'rgb(var(--color-bg-alt))',
              borderRadius: '0.25rem',
              padding: '0.25rem 0.5rem',
              fontSize: '0.875em',
            },
            pre: {
              color: 'inherit',
              backgroundColor: 'rgb(var(--color-bg-alt))',
              borderRadius: '0.5rem',
              padding: '1rem',
              overflowX: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              fontSize: '0.875em',
            },
            hr: {
              borderColor: 'rgb(var(--color-border))',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            h1: {
              color: 'inherit',
              fontWeight: '800',
              letterSpacing: '-0.025em',
              lineHeight: 'var(--leading-tight)',
            },
            h2: {
              color: 'inherit',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              lineHeight: 'var(--leading-tight)',
            },
            h3: {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: 'var(--leading-snug)',
            },
            h4: {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: 'var(--leading-normal)',
            },
            h5: {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: 'var(--leading-normal)',
            },
            h6: {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: 'var(--leading-normal)',
            },
            p: {
              color: 'inherit',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            ul: {
              color: 'inherit',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            ol: {
              color: 'inherit',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            li: {
              color: 'inherit',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            table: {
              color: 'inherit',
              marginTop: '2rem',
              marginBottom: '2rem',
              width: '100%',
              borderCollapse: 'collapse',
            },
            th: {
              color: 'inherit',
              fontWeight: '600',
              backgroundColor: 'rgb(var(--color-bg-alt))',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid rgb(var(--color-border))',
            },
            td: {
              color: 'inherit',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid rgb(var(--color-border))',
            },
            // Typography flushes first/last cells to the measure. Bordered
            // essay tables need that padding back (DEFAULT + prose-lg).
            'thead th:first-child': { paddingInlineStart: '1.5rem' },
            'thead th:last-child': { paddingInlineEnd: '1.5rem' },
            'tbody td:first-child, tfoot td:first-child': {
              paddingInlineStart: '1.5rem',
            },
            'tbody td:last-child, tfoot td:last-child': {
              paddingInlineEnd: '1.5rem',
            },
            img: {
              marginTop: '2rem',
              marginBottom: '2rem',
              borderRadius: '0.5rem',
              width: '100%',
              height: 'auto',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            },
            figure: {
              marginTop: '2rem',
              marginBottom: '2rem',
              width: '100%',
            },
            figcaption: {
              color: 'rgb(var(--color-text-muted))',
              fontSize: '0.875em',
              marginTop: '0.5rem',
              textAlign: 'center',
            },
          },
        },
        lg: {
          css: {
            ...PROSE_LG_ROUNDED,
            'thead th:first-child': { paddingInlineStart: '1.5rem' },
            'thead th:last-child': { paddingInlineEnd: '1.5rem' },
            'tbody td:first-child, tfoot td:first-child': {
              paddingInlineStart: '1.5rem',
            },
            'tbody td:last-child, tfoot td:last-child': {
              paddingInlineEnd: '1.5rem',
            },
          },
        },
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fade-in 200ms cubic-bezier(0, 0, 0.2, 1)',
        'fade-up': 'fade-up 200ms cubic-bezier(0, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [typography, forms],
};
