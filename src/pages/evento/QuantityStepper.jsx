import React from 'react';
import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({
  value,
  onChange,
  canIncrement = true,
  surface = 'white',
  floating = false,
  productName,
}) {
  return (
    <div
      className={`ev-stepper ${surface === 'sunken' ? 'ev-stepper--sunken' : ''} ${
        floating ? 'ev-stepper--floating' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label={`Diminuir quantidade de ${productName}`}
        className="ev-stepper-btn ev-pressable"
      >
        <Minus size={floating ? 15 : 17} strokeWidth={2.2} />
      </button>

      <span className="ev-stepper-val" aria-label={`Quantidade ${value}`}>
        {value}
      </span>

      <button
        type="button"
        disabled={!canIncrement}
        onClick={() => onChange(value + 1)}
        aria-label={`Aumentar quantidade de ${productName}`}
        className="ev-stepper-btn ev-stepper-btn--inc ev-pressable"
      >
        <Plus size={floating ? 15 : 17} strokeWidth={2.4} />
      </button>
    </div>
  );
}
