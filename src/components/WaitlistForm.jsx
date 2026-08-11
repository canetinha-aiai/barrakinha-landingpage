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
 * O botão é preto e não laranja porque texto branco sobre o ember só
 * alcança 4.03 de contraste.
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

  return (
    <div className={cn('w-full max-w-md', className)}>
      <form
        onSubmit={submit}
        className={cn(
          'flex flex-col gap-2.5 sm:flex-row sm:gap-0',
          'sm:rounded-sm sm:border sm:p-1 sm:transition-colors',
          isDark
            ? 'sm:border-ink-700 sm:bg-ink-800 sm:focus-within:border-ember-500'
            : 'sm:border-paper-200 sm:bg-white sm:focus-within:border-ink-900',
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
              : 'border-paper-200 bg-white text-ink-900 placeholder:text-sand-400 focus:border-ink-900',
          )}
        />

        <button
          type="submit"
          disabled={loading}
          className={cn(
            'group inline-flex h-14 w-full shrink-0 items-center justify-center gap-2',
            'rounded-sm text-base font-medium transition-colors disabled:opacity-60',
            'sm:h-11 sm:w-auto sm:px-6 sm:text-[15px]',
            isDark
              ? 'bg-paper text-ink-900 hover:bg-white'
              : 'bg-ink-900 text-paper hover:bg-ink-700',
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
            isDark ? 'text-sand-400' : 'text-sand-500',
          )}
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
};

export default WaitlistForm;
