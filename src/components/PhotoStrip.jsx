import React from 'react';
import { cn } from '@/lib/utils';

/*
  Fotos de comida de rua, de verdade.

  Lê o que estiver em `src/assets/fotos/` no build: é só soltar os
  arquivos lá (jpg, png ou webp) e eles aparecem, na ordem do nome.
  Sem foto na pasta, a faixa não renderiza nada — melhor nenhuma foto
  do que foto de banco que não é daqui.

  A legenda sai do nome do arquivo: `02-pastel-de-feira.jpg` vira
  "pastel de feira".
*/
const files = import.meta.glob('../assets/fotos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const photos = Object.keys(files)
  .sort()
  .map((path) => ({
    src: files[path],
    caption: path
      .split('/')
      .pop()
      .replace(/\.[^.]+$/, '')
      .replace(/^\d+[-_ ]*/, '')
      .replace(/[-_]+/g, ' '),
  }));

const PhotoStrip = ({ className }) => {
  if (photos.length === 0) return null;

  return (
    <div className={cn('flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2', className)}>
      {photos.map((photo, index) => (
        <figure
          key={photo.src}
          className={cn(
            'w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[30%]',
            index % 2 === 1 && 'lg:mt-12',
          )}
        >
          <img
            src={photo.src}
            alt={photo.caption}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full rounded object-cover"
          />
          <figcaption className="mt-2 text-label text-ink-muted first-letter:uppercase">
            {photo.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default PhotoStrip;
