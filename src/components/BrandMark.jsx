import React from 'react';
import { cn } from '@/lib/utils';

/**
 * A marca: o "B" que já é o ícone do app.
 *
 * Vem de `public/icon.png` — o mesmo arquivo que vira o ícone na tela
 * inicial do telefone — e não de um desenho feito para o site. É o que
 * faz o app anunciado aqui e o app instalado serem a mesma coisa.
 *
 * O arquivo é laranja sobre branco, então sobre o laranja da marca ele
 * precisa da placa branca embaixo; é assim que um ícone de app se
 * apresenta de qualquer forma.
 */
const BrandMark = ({ size = 44, className }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center justify-center overflow-hidden bg-white',
      className,
    )}
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
    }}
  >
    <img
      src="/icon.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="h-full w-full object-contain"
    />
  </span>
);

export default BrandMark;
