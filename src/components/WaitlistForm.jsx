import React, { useId } from 'react';
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
 *    em qualquer largura.
 *
 * No `sm` campo e botão dividem a mesma moldura, que escurece quando
 * o campo tem foco — é a moldura que diz "aqui se digita".
 *
 * `tone="ember"` é a versão que mora em cima do laranja: moldura de
 * 2px em noite e campo creme, valores fixos que não seguem o modo
 * escuro do sistema (o laranja também não segue).
 */
const WaitlistForm = ({
  tone = 'paper',
  label = 'Entrar na lista',
  helper,
  messages,
  className,
}) => {
  const id = useId();
  const helperId = `${id}-helper`;
  const { email, setEmail, loading, submit } = useWaitlist(messages);
  const ember = tone === 'ember';

  return (
    <div className={cn('w-full max-w-md', className)}>
      <label
        htmlFor={id}
        className={cn('mb-2.5 block text-label font-semibold', ember ? 'text-night' : 'text-ink')}
      >
        Seu e-mail
      </label>

      <form
        onSubmit={submit}
        className={cn(
          'flex flex-col gap-2.5 sm:flex-row sm:gap-0 sm:rounded sm:p-1 sm:transition-colors sm:duration-150',
          ember
            ? 'sm:border-2 sm:border-night sm:bg-cream'
            : 'sm:border sm:border-line-strong sm:bg-paper sm:focus-within:border-ink',
        )}
      >
        <input
          id={id}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          required
          autoComplete="email"
          inputMode="email"
          aria-describedby={helper ? helperId : undefined}
          className={cn(
            'h-14 w-full min-w-0 rounded px-4 text-base outline-none transition-colors duration-150 focus-visible:ring-0 sm:h-12 sm:flex-1 sm:border-0 sm:bg-transparent sm:px-3',
            ember
              ? 'border-2 border-night bg-cream text-night placeholder:text-night/50'
              : 'border border-line-strong bg-paper text-ink placeholder:text-ink-muted/70 focus:border-ink',
          )}
        />

        <button
          type="submit"
          disabled={loading}
          className={cn(
            'h-14 w-full shrink-0 text-base disabled:pointer-events-none disabled:opacity-60 sm:h-12 sm:w-auto',
            ember ? 'btn-night' : 'btn-primary',
          )}
        >
          {loading ? 'Enviando…' : label}
        </button>
      </form>

      {helper ? (
        <p
          id={helperId}
          className={cn('mt-3 text-[14px] leading-relaxed', ember ? 'text-night/75' : 'text-ink-muted')}
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
};

export default WaitlistForm;
