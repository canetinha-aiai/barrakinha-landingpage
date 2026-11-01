/** @type {import('tailwindcss').Config} */

/* Cor como variável RGB, pra o Tailwind continuar aceitando opacidade
   (`bg-paper/90`) e pra o modo escuro trocar o valor sem trocar classe. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

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
			/*
			  Os mesmos tokens da v2 do app do vendedor (`src/global.css`):
			  papel, tinta, filete. O site e o produto têm que parecer a
			  mesma coisa.

			  Os tons numerados (`ink-900`, `ink-600`, `paper-200`,
			  `sand-300`) são apelidos dos tokens novos e só existem pra
			  política de privacidade continuar funcionando sem reescrita.
			  Componente novo usa o nome do papel, não o número.
			*/
			colors: {
				paper: {
					DEFAULT: token('paper'),
					raised: token('paper-raised'),
					200: token('line'),
				},
				ink: {
					DEFAULT: token('ink'),
					muted: token('ink-muted'),
					900: token('ink'),
					600: token('ink-muted'),
				},
				line: {
					DEFAULT: token('line'),
					strong: token('line-strong'),
				},
				sand: {
					300: token('line-strong'),
				},
				/* Laranja da marca. `DEFAULT` (#F85A35) só preenche — ponto,
				   marca, foco. Texto em laranja usa `ember-text`, o único tom
				   que passa 4,5:1 sobre o papel. */
				ember: {
					DEFAULT: token('ember'),
					text: token('ember-text'),
				},
				/* As superfícies de marca não seguem o modo do sistema: o
				   laranja é sempre laranja e a noite é sempre noite. Por isso
				   são valores fixos, com o texto que mora em cima delas. */
				night: {
					DEFAULT: '#1D1611',
					muted: '#A29C94',
					line: 'rgb(251 247 242 / 0.14)',
				},
				cream: '#FBF7F2',

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
			/* Uma família só, a do app. A hierarquia sai de peso, tamanho e
			   entrelinha juntos, não de uma segunda fonte. */
			fontFamily: {
				display: ['Archivo', 'system-ui', 'sans-serif'],
				sans: ['Archivo', 'system-ui', 'sans-serif'],
			},
			/* Tracking por tamanho: negativo no grande, zero no corpo,
			   levemente positivo no rótulo pequeno. Um valor fixo pra tudo
			   estaria errado em algum lugar. */
			fontSize: {
				label: ['0.8125rem', { lineHeight: '1.3', letterSpacing: '0.01em' }],
				'display-sm': ['2.25rem', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
				'display-md': ['3.25rem', { lineHeight: '1.0', letterSpacing: '-0.035em' }],
				'display-lg': ['4.5rem', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
			},
			/* Raio único. Tudo que tem canto tem o mesmo canto. */
			borderRadius: {
				DEFAULT: '10px',
				sm: '10px',
				md: '10px',
				lg: '10px',
			},
			maxWidth: {
				/* Medida curta de propósito: força frase curta. */
				prose: '52ch',
			},
			keyframes: {
				enter: {
					from: { opacity: 0, transform: 'translateY(8px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
				marquee: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-50%)' },
				},
			},
			animation: {
				enter: 'enter 500ms cubic-bezier(0.23, 1, 0.32, 1) both',
				marquee: 'marquee 40s linear infinite',
			},
			transitionTimingFunction: {
				out: 'cubic-bezier(0.23, 1, 0.32, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
