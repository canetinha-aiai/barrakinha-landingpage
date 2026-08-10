import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Pra você', href: '#pra-voce' },
  { label: 'Pra vendedor', href: '#pra-vendedor' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (event, href) => {
    event.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open
          ? 'border-b border-ink-700 bg-ink-900/95 backdrop-blur-sm'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <a
          href="#top"
          onClick={(event) => go(event, '#top')}
          className="font-display text-lg font-extrabold tracking-[-0.04em] text-cream-50"
        >
          barrakinha
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => go(event, link.href)}
              className="text-[13px] text-sand-400 transition-colors hover:text-cream-50"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#lista"
            onClick={(event) => go(event, '#lista')}
            className="rounded-sm bg-cream-50 px-4 py-2 text-[13px] font-medium text-ink-900 transition-colors hover:bg-white"
          >
            Entrar na lista
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-cream-50 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-ink-700 bg-ink-900 px-5 py-3 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => go(event, link.href)}
              className="block py-3 text-[15px] text-sand-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#lista"
            onClick={(event) => go(event, '#lista')}
            className="mt-2 mb-1 block rounded-sm bg-ember-500 px-4 py-3 text-center text-[15px] font-medium text-ember-900"
          >
            Entrar na lista
          </a>
        </nav>
      ) : null}
    </header>
  );
};

export default Header;
