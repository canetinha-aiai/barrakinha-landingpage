import React from 'react';
import { BellRing, Check, ChefHat } from 'lucide-react';

/* Trilho horizontal fiel ao `ProgressRail.tsx`, 100% genérico para qualquer
   barraca e sem nenhum símbolo de pagamento/cifrão (`Check -> ChefHat -> BellRing`). */
export function EventProgressRail({ isReady }) {
  const steps = [
    { key: 'sent', label: 'Pedido feito', Icon: Check },
    { key: 'queue', label: 'Na fila', Icon: ChefHat },
    { key: 'ready', label: 'Pronto', Icon: BellRing },
  ];

  /* Na fila: cor da barraca (brasa por padrão). Pronto: verde de sucesso. */
  const activeColor = isReady ? '#147541' : 'var(--ev-brasa)';
  const onActiveColor = isReady ? '#FFFFFF' : 'var(--ev-on-brasa)';
  const fillFraction = isReady ? 1 : 0.5;

  return (
    <div
      className="ev-rail"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={isReady ? 3 : 2}
      aria-label={isReady ? 'Etapa 3 de 3: Pronto para retirar' : 'Etapa 2 de 3: Na fila de preparo'}
    >
      <div className="ev-rail-track-wrap">
        <div className="ev-rail-line-bg" />
        <div
          className="ev-rail-line-fill"
          style={{
            backgroundColor: activeColor,
            transform: `translateY(-50%) scaleX(${fillFraction})`,
          }}
        />
        <div className="ev-rail-nodes">
          {steps.map(({ key, Icon }, index) => {
            const filled = isReady || index <= 1;
            const pulsing = !isReady && index === 1;
            return (
              <div key={key}>
                <div
                  className={`ev-rail-node ${pulsing ? 'ev-pulse-node' : ''}`}
                  style={{
                    backgroundColor: filled ? activeColor : '#FFFFFF',
                    border: filled ? 'none' : '2px solid #DCD2C8',
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={2.4}
                    style={{ color: filled ? onActiveColor : '#8A7E75' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ev-rail-labels">
        {steps.map(({ key, label }, index) => {
          const doneOrActive = isReady || index <= 1;
          return (
            <span
              key={key}
              className="ev-caption"
              style={{
                color: isReady && index === 2 ? '#147541' : doneOrActive ? '#1F1611' : '#8A7E75',
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
