import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ember (warm editorial signal)
        primary: {
          50: '#fdf4f1',
          100: '#fce8e2',
          200: '#f7cfc4',
          300: '#eeaa97',
          400: '#e07e66',
          500: '#b43e2a',
          600: '#943020',
          700: '#7a281c',
          800: '#662419',
          900: '#562118',
        },

        // Same family as primary — single accent system
        accent: {
          50: '#fdf4f1',
          100: '#fce8e2',
          200: '#f7cfc4',
          300: '#eeaa97',
          400: '#e07e66',
          500: '#b43e2a',
          600: '#943020',
          700: '#7a281c',
          800: '#662419',
          900: '#562118',
        },

        // Soft warm wash (selection / rare emphasis)
        highlight: {
          50: '#fbf6ec',
          100: '#f5ebd4',
          200: '#ead7a8',
          300: '#dcb878',
          400: '#d4a85c',
          500: '#c4923c',
          600: '#a8762e',
          700: '#855a28',
          800: '#6d4a26',
          900: '#5b3e23',
        },

        // Status colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#2e8c5a',
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
          500: '#b47824',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        error: {
          50: '#fdf4f1',
          100: '#fce8e2',
          200: '#f7cfc4',
          300: '#eeaa97',
          400: '#e07e66',
          500: '#b43e2a',
          600: '#943020',
          700: '#7a281c',
          800: '#662419',
          900: '#562118',
        },

        // Warm stone neutrals
        neutral: {
          50: '#faf8f5',
          100: '#f1ede7',
          200: '#e5e0d7',
          300: '#d6cec4',
          400: '#a89e92',
          500: '#6c625a',
          600: '#544c46',
          700: '#3c3632',
          800: '#2c2824',
          900: '#1c1917',
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
        xs: ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        sm: ['1rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        base: ['1.125rem', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        lg: ['1.25rem', { lineHeight: '1.75', letterSpacing: '0.01em' }],
        xl: ['1.5rem', { lineHeight: '1.6', letterSpacing: '0em' }],
        '2xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '3xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        '4xl': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '6xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      spacing: {
        // Vertical rhythm system
        section: '4rem', // 64px - Major section spacing
        block: '2rem', // 32px - Block-level spacing
        element: '1rem', // 16px - Element-level spacing
        content: '0.75rem', // 12px - Content-level spacing
        tight: '0.375rem', // 6px  - Tight spacing

        // Legacy spacing (keep for backward compatibility)
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
        '5xl': '8rem',
      },
      maxWidth: {
        // Content widths
        prose: '65ch', // Optimal reading width
        'prose-wide': '85ch', // Wider content area

        // Layout containers - optimized for full-width layouts
        container: '1400px', // Increased from 1280px for better full-width experience
        'container-narrow': '1024px', // For focused content
        'container-wide': '1600px', // For full-width layouts with max constraint

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
              lineHeight: '1.2',
            },
            h2: {
              color: 'inherit',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              lineHeight: '1.3',
            },
            h3: {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: '1.4',
            },
            h4: {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: '1.5',
            },
            h5: {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: '1.6',
            },
            h6: {
              color: 'inherit',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: '1.6',
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
