import React from 'react';
import { ChevronRight } from 'lucide-react';

export function BarrakinhaPromoFooter() {
  return (
    <footer className="ev-promo-footer">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="ev-promo-link ev-pressable"
      >
        <img
          src="/logo/barrakinha-logo.svg"
          alt=""
          width={24}
          height={24}
          style={{ width: 24, height: 24, display: 'block', flexShrink: 0 }}
        />
        <span>
          Feito com <strong>Barrakinha</strong> · Conheça o app
        </span>
        <ChevronRight size={14} strokeWidth={2.2} />
      </a>
    </footer>
  );
}
