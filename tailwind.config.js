/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '1.25rem',
			screens: {
				'2xl': '1200px',
			},
		},
		extend: {
			colors: {
				/* Base escura quente — a página inteira vive aqui */
				ink: {
					950: '#0F0E0D',
					900: '#131211',
					800: '#1B1917',
					700: '#242220',
					600: '#2E2B28',
					500: '#3A3631',
				},
				/* Creme — texto sobre escuro e fundo das seções invertidas */
				cream: {
					50: '#F7F2E7',
					100: '#EFE8D9',
					200: '#E2D9C6',
				},
				/* Neutros quentes — texto secundário */
				sand: {
					300: '#BDB5A4',
					400: '#A39C8D',
					500: '#8A8375',
					600: '#6B655A',
				},
				/* Acento único. Sem gradiente, sem segunda cor de marca. */
				ember: {
					400: '#FF8A63',
					500: '#FF6B3D',
					600: '#E85427',
					900: '#3D1A0C',
				},
				/* Sinalização — usado só em status, nunca decorativo */
				signal: {
					open: '#5FBF88',
					dim: '#1C3A2A',
				},

				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			fontFamily: {
				display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				/* Escala editorial: títulos gigantes com tracking negativo,
				   corpo pequeno e confortável. O contraste entre os dois é o
				   que dá caráter — não a cor. */
				'display-sm': ['2.5rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
				'display-md': ['3.5rem', { lineHeight: '0.92', letterSpacing: '-0.045em' }],
				'display-lg': ['4.75rem', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
				'display-xl': ['6rem', { lineHeight: '0.88', letterSpacing: '-0.055em' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			maxWidth: {
				prose: '62ch',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'pulse-dot': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.35' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
			},
			transitionTimingFunction: {
				'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
