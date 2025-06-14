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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				chef: {
					'royal-green': '#014421', // Will be less used in Hero
					'royal-blue': '#0B1F66', // Primary blue
					'warm-ivory': '#F9F6F1', // Primary cream/white
					'charcoal': '#1C1C1C',
					'gold': '#C2A83E', // Will be less used in Hero
					'green-light': '#036B35',
					'blue-light': '#1A3A8A', // Lighter blue for accents/hovers
					'cream': '#FDF8F0', // Secondary cream/white
					'forest': '#0A3D1F',
					'navy': '#091852',
					'bronze': '#A8944D',
                    'amber': '#C69A3A', // New warm gold/amber
                    'soft-peach': '#FFE5B4', // New soft, warm peach
                    'warm-sand': '#F0E6D2', // New warm neutral, richer than ivory
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'playfair': ['Playfair Display', 'serif'],
				'inter': ['Inter', 'sans-serif'],
				'space': ['Space Grotesk', 'sans-serif'],
			},
			backgroundImage: {
				'chef-gradient': 'linear-gradient(135deg, #0B1F66 0%, #1A3A8A 100%)', // Updated from green/blue to blue/lightblue
				'gold-gradient': 'linear-gradient(135deg, #F9F6F1 0%, #FDF8F0 100%)', // Changed to ivory/cream gradient
				'luxury-gradient': 'linear-gradient(135deg, #F9F6F1 0%, #FDF8F0 100%)',
                'warm-glow-gradient': 'linear-gradient(135deg, hsl(var(--chef-warm-sand)) 0%, hsl(var(--chef-soft-peach)) 100%)', // New warm gradient
                'hero-text-gradient': 'linear-gradient(to right, hsl(var(--chef-soft-peach)), hsl(var(--chef-warm-sand)))', // New for hero text
			},
			boxShadow: {
				'chef-luxury': '0 20px 25px -5px rgba(11, 31, 102, 0.1), 0 8px 10px -6px rgba(11, 31, 102, 0.1)', // Blue based shadow
				'chef-gold': '0 10px 15px -3px rgba(198, 154, 58, 0.2), 0 4px 6px -4px rgba(198, 154, 58, 0.2)', // Updated to use amber tones
        'chef-blue-md': '0 4px 6px -1px rgba(11, 31, 102, 0.1), 0 2px 4px -2px rgba(11, 31, 102, 0.1)',
        'chef-blue-lg': '0 10px 15px -3px rgba(11, 31, 102, 0.1), 0 4px 6px -4px rgba(11, 31, 102, 0.1)',
        'chef-blue-xl': '0 20px 25px -5px rgba(11, 31, 102, 0.1), 0 8px 10px -6px rgba(11, 31, 102, 0.1)',
        'chef-ivory-glow': '0 0 20px rgba(249, 246, 241, 0.4)',
        'chef-warm-glow': '0 0 25px rgba(198, 154, 58, 0.3)', // New warm glow shadow
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'scale-in-out': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'chef-glow': { // Updated to blue glow
					'0%, 100%': { boxShadow: '0 0 20px rgba(198, 154, 58, 0.25)' }, // Updated to warm glow
					'50%': { boxShadow: '0 0 30px rgba(198, 154, 58, 0.45)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in': 'slide-in 0.4s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'scale-in-out': 'scale-in-out 3s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'shimmer': 'shimmer 3s linear infinite',
				'chef-glow': 'chef-glow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
