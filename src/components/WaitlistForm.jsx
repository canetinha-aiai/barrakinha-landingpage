import React, { useId } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWaitlist } from '@/hooks/useWaitlist';

/**
 * Campo + botão de inscrição.
 *
 * Duas armadilhas que este componente já pagou:
 *
 * 1. `flex-1` no input. Em `flex-col`, isso vira `flex-basis: 0` e o
 *    navegador ignora a altura declarada — o campo colapsava pra altura
 *    da linha de texto no celular. Por isso o `flex-1` só entra a
 *    partir do `sm`, quando o form vira linha.
 *
 * 2. Fonte menor que 16px em input faz o Safari do iPhone dar zoom
 *    sozinho ao focar, e a página nunca volta ao lugar. O campo é 16px
 *    no mobile e só encolhe pra 15px no desktop.
 *
 * Três tons, porque o formulário aparece em três fundos: `light` no
 * papel, `dark` no bloco escuro e `brand` em cima do laranja da marca.
 *
 * O `brand` já foi de vidro — moldura e campo em branco translúcido.
 * Ficou ilegível: por baixo dele passa a listra do toldo, e texto de
 * pouco contraste sobre fundo listrado é o pior caso possível. Agora a
 * moldura é branca sólida, o que além de resolver a leitura deixa claro
 * que ali se digita. Só o texto de apoio, que vive fora da moldura,
 * continua em branco.
 *
 * O botão em degradê é a identidade do site — é o único botão com
 * esse peso, em toda página. Trocá-lo por branco sólido no mobile (a
 * primeira tentativa de resolver o sumiço nas listras) resolvia o
 * contraste, mas o botão principal do site passava a parecer um botão
 * secundário. A borda branca resolve os dois: o preenchimento continua
 * o degradê da marca — a forma que o botão sempre teve —, e é só o
 * contorno que separa a pílula do fundo listrado atrás dela. Dentro da
 * cápsula branca do `sm:` a borda não faz falta: o branco ao redor já
 * cumpre esse papel.
 */
const WaitlistForm = ({
  tone = 'light',
  label = 'Quero acesso',
  helper,
  messages,
  className,
}) => {
  const id = useId();
  const { email, setEmail, loading, submit } = useWaitlist(messages);

  const isDark = tone === 'dark';
  const isBrand = tone === 'brand';

  return (
    <div className={cn('w-full max-w-md', className)}>
      <form
        onSubmit={submit}
        className={cn(
          'flex flex-col gap-2.5 sm:flex-row sm:gap-0',
          'sm:rounded-sm sm:border sm:p-1 sm:transition-colors',
          isDark
            ? 'sm:border-ink-700 sm:bg-ink-800 sm:focus-within:border-ember-500'
            : 'sm:border-paper-200 sm:bg-white sm:focus-within:border-ember-400',
        )}
      >
        <label htmlFor={id} className="sr-only">
          Seu e-mail
        </label>

        <input
          id={id}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu@email.com"
          required
          autoComplete="email"
          inputMode="email"
          className={cn(
            'h-14 w-full min-w-0 rounded-sm border px-4 text-base',
            'outline-none transition-colors',
            'sm:h-11 sm:flex-1 sm:border-0 sm:bg-transparent sm:px-3 sm:text-[15px]',
            isDark
              ? 'border-ink-700 bg-ink-800 text-paper placeholder:text-sand-400 focus:border-ember-500'
              : 'border-paper-200 bg-white text-ink-900 placeholder:text-sand-400 focus:border-ember-400',
          )}
        />

        <button
          type="submit"
          disabled={loading}
          className={cn(
            'group inline-flex h-14 w-full shrink-0 items-center justify-center gap-2',
            'rounded-full text-base font-semibold transition-all disabled:opacity-60',
            'sm:h-11 sm:w-auto sm:px-7 sm:text-[15px]',
            isDark
              ? 'bg-paper text-ink-900 hover:bg-white'
              : isBrand
                ? 'border-2 border-white/95 bg-brand text-white shadow-float hover:brightness-105 sm:border-transparent sm:shadow-glow'
                : 'bg-brand text-white shadow-glow hover:brightness-105',
          )}
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
              Enviando
            </>
          ) : (
            <>
              {label}
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      {helper ? (
        <p
          className={cn(
            'mt-3.5 text-[13px] leading-relaxed',
            isDark
              ? 'text-sand-400'
              : isBrand
                ? 'text-white'
                : 'text-sand-500',
          )}
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
};

export default WaitlistForm;
