import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

/* Tela de sucesso do totem: só a senha, sem acompanhamento.
   Feita para ser lida a alguns passos de distância: fundo brasa chapado,
   a senha num cartão de papel em Archivo larga, a instrução em branco e
   uma barra que mostra quanto falta para a tela voltar ao início. */
export function TotemSuccess({ order, storeName, durationMs, onDone }) {
  const totalSeconds = Math.round(durationMs / 1000);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    const startedAt = Date.now();
    const t = setInterval(() => {
      const left = Math.max(0, Math.ceil((durationMs - (Date.now() - startedAt)) / 1000));
      setSecondsLeft(left);
    }, 250);
    return () => clearInterval(t);
  }, [durationMs]);

  /* A barra do navegador acompanha o brasa enquanto a senha está na tela. */
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return undefined;
    const previous = meta.getAttribute('content');
    meta.setAttribute('content', '#EC5512');
    return () => meta.setAttribute('content', previous);
  }, []);

  const name = storeName || order.storeName;
  const digits = String(order.displayNumber ?? '').length;

  return (
    <main className="ev-totem-success" role="status" aria-live="polite">
      <header className="ev-totem-brand">
        <span className="ev-totem-brand-mark">
          <img src="/logo/barrakinha-logo-branca.svg" alt="" width={36} height={36} />
          <span className="ev-totem-brand-name">Barrakinha</span>
        </span>
        {name ? <span className="ev-totem-brand-store">{name}</span> : null}
      </header>

      <div className="ev-totem-center">
        <p className="ev-totem-kicker">
          <span className="ev-totem-check" aria-hidden="true">
            <Check size={22} strokeWidth={3.2} />
          </span>
          Pedido confirmado
        </p>

        <div className="ev-totem-ticket">
          <p className="ev-totem-ticket-label">Sua senha</p>
          <p
            className={`ev-totem-number ev-tabular${
              digits >= 4 ? ' ev-totem-number--xlong' : digits === 3 ? ' ev-totem-number--long' : ''
            }`}
            aria-label={`Sua senha é ${order.displayNumber}`}
          >
            <span className="ev-totem-hash" aria-hidden="true">#</span>
            {order.displayNumber}
          </p>
        </div>

        <p className="ev-totem-hint">Aguarde ser chamado no balcão.</p>
      </div>

      <footer className="ev-totem-actions">
        <button type="button" className="ev-btn ev-totem-btn ev-pressable" onClick={onDone}>
          Fazer novo pedido
        </button>
        <div className="ev-totem-timer">
          <div className="ev-totem-timer-track" aria-hidden="true">
            <div
              className="ev-totem-timer-fill"
              style={{ animationDuration: `${durationMs}ms` }}
            />
          </div>
          <p className="ev-totem-timer-text">
            A tela volta ao início em <span className="ev-tabular">{secondsLeft}s</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
