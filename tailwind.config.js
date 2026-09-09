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
				/* Papel — fundo da página. Creme quente, os mesmos valores do app:
				   o site e o produto têm que parecer a mesma coisa. */
				paper: {
					DEFAULT: '#FBF7F2',
					100: '#F4EEE7',
					200: '#EFE7DE',
				},
				/* Tinta — texto e as poucas superfícies escuras */
				ink: {
					950: '#0F0C09',
					900: '#1D1611',
					800: '#2A211A',
					700: '#453B31',
					600: '#6B6560',
				},
				/* Neutros quentes de apoio */
				sand: {
					300: '#DFD5C9',
					400: '#A8A096',
					500: '#6B6560',
				},
				/* Laranja da marca, nos mesmos valores do app.
				   O 700 é o único tom que passa em contraste sobre papel (4.6),
				   então é ele que carrega texto e ícone. O 500 e o 600 são as
				   pontas do degradê e só entram em preenchimento. */
				ember: {
					700: '#C43D1C',
					600: '#F43F1E',
					500: '#FF8A3D',
					400: '#F85A35',
					100: '#FFE8DD',
				},
				signal: {
					open: '#0E9F6E',
					dim: '#DCF5EC',
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
			/* Escala do app: o arredondado generoso é parte da cara da marca,
			   e 8px chapado era o que dava ao site um ar de documento. */
			borderRadius: {
				sm: '10px',
				md: '12px',
				lg: '16px',
				xl: '20px',
				'2xl': '24px',
				'3xl': '28px',
			},

			/* O degradê da marca e a faixa de toldo, os dois gestos que o site
			   herda do app. A faixa é `repeating-linear-gradient` — listra é
			   retângulo repetido, não desenho. */
			backgroundImage: {
				brand: 'linear-gradient(135deg, #FF8A3D 0%, #F43F1E 100%)',
				'brand-soft': 'linear-gradient(135deg, #FFF3EC 0%, #FFE4D6 100%)',
				awning:
					'repeating-linear-gradient(-20deg, rgba(255,255,255,0.18) 0 14px, transparent 14px 28px)',
				'awning-lg':
					'repeating-linear-gradient(-20deg, rgba(255,255,255,0.08) 0 30px, transparent 30px 60px)',
			},

			boxShadow: {
				soft: '0 5px 14px rgba(58,30,16,0.07)',
				lift: '0 10px 28px rgba(58,30,16,0.10)',
				float: '0 14px 36px rgba(90,26,8,0.22)',
				glow: '0 8px 22px rgba(248,90,53,0.35)',
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
				marquee: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-50%)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				marquee: 'marquee 32s linear infinite',
			},
			transitionTimingFunction: {
				'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
