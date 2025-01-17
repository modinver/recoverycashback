import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            'h1': {
              marginTop: '2rem',
              marginBottom: '1.5rem',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              fontWeight: '100', // Reduced from 200 to 100 for thinner appearance
              letterSpacing: '-0.025em',
              color: 'hsl(var(--foreground))',
              fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif',
            },
            'h2': {
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              fontWeight: '100', // Reduced from 200 to 100 for thinner appearance
              letterSpacing: '-0.025em',
              color: 'hsl(230, 84%, 70%)', // Changed to a more professional blue-violet shade
              fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif',
            },
            'h3': {
              marginTop: '2rem',
              marginBottom: '1rem',
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontWeight: '100', // Reduced from 200 to 100 for thinner appearance
              letterSpacing: '-0.025em',
              color: 'hsl(var(--foreground))',
              fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif',
            },
            'p': {
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              lineHeight: '1.75',
              fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif',
            },
            'ul': {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.625rem',
              listStyleType: 'disc',
              'li::marker': {
                color: 'hsl(var(--primary))',
              },
            },
            'li': {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif',
            },
            'blockquote': {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: 'hsl(var(--primary))',
              paddingLeft: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif',
            },
            'code': {
              color: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--muted))',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontFamily: 'SF Mono, monospace',
            },
            'pre': {
              backgroundColor: 'hsl(var(--muted))',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
            },
            'a': {
              color: 'hsl(var(--primary))',
              textDecoration: 'underline',
              '&:hover': {
                color: 'hsl(var(--primary))',
                opacity: 0.8,
              },
            },
            'img': {
              borderRadius: '0.5rem',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
          },
        },
        dark: {
          css: {
            'h2': {
              color: 'hsl(230, 84%, 70%)', // Match the light theme H2 color
            },
            'blockquote': {
              borderLeftColor: 'hsl(var(--primary))',
            },
            'code': {
              color: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--muted))',
            },
            'pre': {
              backgroundColor: 'hsl(var(--muted))',
            },
            'a': {
              color: 'hsl(var(--primary))',
            },
            'ul': {
              'li::marker': {
                color: 'hsl(var(--primary))',
              },
            },
          },
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
