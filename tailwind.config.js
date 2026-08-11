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
				/* Papel — fundo da página. Creme, não branco: branco puro
				   deixa a página com cara de documento. */
				paper: {
					DEFAULT: '#FAF7F0',
					100: '#F3EEE3',
					200: '#E7E0D0',
				},
				/* Tinta — texto e as poucas superfícies escuras (CTA, rodapé) */
				ink: {
					950: '#0F0E0A',
					900: '#16150F',
					800: '#24221A',
					700: '#3F3B30',
					600: '#57513F',
				},
				/* Neutros quentes de apoio */
				sand: {
					300: '#BDB5A4',
					400: '#9A9282',
					500: '#6E6858',
				},
				/* Acento único.
				   O 700 é o único tom que passa em contraste sobre papel
				   (5.1), então é ele que carrega texto e ícone. O 600 e o
				   500 só entram em preenchimento — nunca atrás de texto. */
				ember: {
					700: '#B8420F',
					600: '#D9531E',
					500: '#F0632B',
					100: '#FBE7DB',
				},
				signal: {
					open: '#2F7D51',
					dim: '#DCEFE2',
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
				'display-sm': ['2.5rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
				'display-md': ['3.5rem', { lineHeight: '0.92', letterSpacing: '-0.045em' }],
				'display-lg': ['4.75rem', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			maxWidth: {
				/* Medida curta de propósito: força frase curta. */
				prose: '52ch',
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
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			transitionTimingFunction: {
				'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
