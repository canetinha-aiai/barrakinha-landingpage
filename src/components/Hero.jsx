import React from 'react';
import Magnetic from '@/components/Magnetic';
import WordCycle from '@/components/fluid/WordCycle';
import SpringPress from '@/components/fluid/SpringPress';

/*
  O hero: título, frase e as duas ações, numa coluna só.

  Fundo de papel, o mesmo do resto da página e do app. O laranja da
  marca vai nos elementos, não na superfície: o botão principal, a
  palavra que alterna no título — e o header, laranja chapado. Texto
  laranja sobre o papel usa `ember-text` (#C43D1C, 4,6:1); o #F85A35
  puro só pinta preenchimento, como o botão.

  Sem imagem do lado: o título grande, em letra larga, é a figura. As
  telas do app vêm logo abaixo, nos três passos de "Pra quem compra".

  O título sobe palavra por palavra de trás de uma máscara. É CSS
  (`animate-word-rise`), não Motion: roda já no HTML pré-renderizado e
  não pisca quando o React assume.
*/
const TITLE = 'O mapa da comida de rua do seu bairro.';

/* A última palavra do título passa pelo Word Cycle da Fluid: depois
   que o título sobe, ela fica trocando devagar entre os lugares onde a
   pessoa come na rua. "bairro." é a oficial: é o que o HTML
   pré-renderizado, o leitor de tela e quem pede menos movimento veem. */
const CYCLE = ['bairro.', 'trabalho.', 'caminho.'];

const Hero = () => {
  const go = (event, href) => {
    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const words = TITLE.split(' ');

  return (
    <section id="top" className="relative bg-paper pt-16 text-ink">
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <h1 className="display-wide max-w-[13ch] text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-balance sm:text-[4.4rem] lg:text-[6rem]">
            {words.map((word, index) => (
              <React.Fragment key={`${word}-${index}`}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-top">
                  <span
                    className="inline-block animate-word-rise motion-reduce:animate-none"
                    style={{ animationDelay: `${60 + index * 55}ms` }}
                  >
                    {index === words.length - 1 ? (
                      <span className="text-ember-text">
                        <WordCycle words={CYCLE} every={2.4} delay={1.2} />
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                </span>
                {index < words.length - 1 ? ' ' : null}
              </React.Fragment>
            ))}
          </h1>

          <p className="mt-7 max-w-[42ch] animate-enter text-[18px] leading-relaxed lg:mt-9 lg:text-[20px] text-ink-muted text-pretty [animation-delay:520ms]">
            Veja quais barracas estão abertas agora perto de você, peça pelo app
            e retire o pedido pronto na barraca.
          </p>

          <div className="mt-9 flex animate-enter flex-col gap-5 [animation-delay:620ms] sm:flex-row sm:items-center sm:gap-7">
            <Magnetic className="w-full sm:w-auto">
              <SpringPress
                as="a"
                href="#lista"
                onClick={(event) => go(event, '#lista')}
                className="btn-ember h-14 w-full text-base sm:h-12 sm:w-auto"
              >
                Entrar na lista de espera
              </SpringPress>
            </Magnetic>
            <a
              href="/vendedores"
              className="group relative self-center rounded text-[16px] font-semibold sm:self-auto"
            >
              Tenho uma barraca
              {/* Sublinhado que se redesenha da esquerda no hover. */}
              <span aria-hidden="true" className="absolute inset-x-0 -bottom-1.5 h-0.5 bg-ink/30" />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1.5 h-0.5 origin-left scale-x-0 bg-ember transition-transform duration-300 ease-out hover-fine:group-hover:scale-x-100"
              />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
