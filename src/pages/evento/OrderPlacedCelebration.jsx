import React, { useCallback, useState } from 'react';
import { Check } from 'lucide-react';

/**
 * Confirmação "Pedido confirmado" no celular, na mesma linguagem do totem:
 * brasa chapado, selo mostarda com check, a senha num cartão de papel em
 * Archivo larga. Toque em qualquer lugar sobe a cortina e revela a tela de
 * acompanhamento da senha.
 */
export function OrderPlacedCelebration({ order, onComplete }) {
  const [lifting, setLifting] = useState(false);

  const dismiss = useCallback(() => {
    if (lifting) return;
    setLifting(true);
    setTimeout(() => onComplete?.(), 460);
  }, [lifting, onComplete]);

  const number = order?.displayNumber ?? 14;
  const digits = String(number).length;

  return (
    <div
      className={`ev-celebration ${lifting ? 'ev-celebration--lifting' : ''}`}
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          e.preventDefault();
          dismiss();
        }
      }}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
      aria-label={`Pedido confirmado! Sua senha é número ${number}. Toque na tela para acompanhar.`}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <div className="ev-celebration-stage">
        {/* Faíscas subindo: secundária (mostarda), texto sobre a primária
            (branco) e o tom claro da primária (creme), como no padrão. */}
        {[
          { left: '14%', top: '70%', size: 8, color: 'var(--ev-mostarda)', delay: '120ms' },
          { left: '84%', top: '66%', size: 7, color: 'var(--ev-on-brasa)', delay: '260ms' },
          { left: '22%', top: '22%', size: 6, color: 'var(--ev-brasa-soft)', delay: '420ms' },
          { left: '78%', top: '20%', size: 9, color: 'var(--ev-mostarda)', delay: '180ms' },
          { left: '8%', top: '44%', size: 6, color: 'var(--ev-on-brasa)', delay: '520ms' },
          { left: '90%', top: '42%', size: 7, color: 'var(--ev-mostarda)', delay: '360ms' },
        ].map((s, idx) => (
          <div
            key={idx}
            className="ev-celebration-spark"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: s.color,
              animationDelay: s.delay,
            }}
          />
        ))}

        <div className="ev-celebration-content">
          <p className="ev-totem-kicker ev-celebration-kicker">
            <span className="ev-totem-check" aria-hidden="true">
              <Check size={20} strokeWidth={3.2} />
            </span>
            Pedido confirmado
          </p>

          <div className="ev-totem-ticket ev-celebration-ticket">
            <p className="ev-totem-ticket-label">Sua senha</p>
            <p
              className={`ev-totem-number ev-celebration-number ev-tabular${
                digits >= 3 ? ' ev-celebration-number--long' : ''
              }`}
            >
              <span className="ev-totem-hash" aria-hidden="true">#</span>
              {number}
            </p>
            {order?.storeName ? (
              <p className="ev-celebration-store">{order.storeName}</p>
            ) : null}
          </div>

          <p className="ev-celebration-note">
            Avisaremos no seu WhatsApp assim que ficar pronto no balcão.
          </p>

          <span className="ev-celebration-cta">Toque para acompanhar</span>
        </div>
      </div>
    </div>
  );
}
