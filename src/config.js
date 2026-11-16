export const config = {
  // Coloque aqui a URL do seu formulário do Sheet Monkey
  // Exemplo: "https://api.sheetmonkey.io/form/KLVqjvFfXe7u8SCge1oxP"
  googleSheetUrl: "https://api.sheetmonkey.io/form/KLVqjvFfXe7u8SCge1oxP",
};

/*
INSTRUÇÕES PARA CONFIGURAR O SHEET MONKEY:
1. Acesse https://sheetmonkey.io e faça login/crie uma conta gratuita.
2. Crie um novo formulário (Create Form) apontando para a sua planilha do Google Sheets desejada.
3. Copie a URL do formulário gerada pelo Sheet Monkey (form action).
4. Cole essa URL acima no campo `googleSheetUrl` da constante config.
5. Pronto!! Todas as inscrições feitas no site serão enviadas automaticamente para a sua Planilha do Google.
*/

/*
  DARK_MODE_ENABLED: a página segue o modo escuro do sistema? Como no
  app (DARK_MODE_ENABLED em src/constants/theme.ts), está desligado: a
  landing é sempre papel claro. É só uma constante — não existe botão
  nem seletor de tema pro visitante.

  A paleta escura continua em src/index.css, atrás da classe
  `theme-auto` no <html>; quem põe essa classe (e o color-scheme /
  theme-color das páginas) é o plugin `colorScheme` do vite.config.js,
  lendo esta constante. Pra religar, troque pra `true` e reinicie o
  `npm run dev` ou rode o build de novo.
*/
export const DARK_MODE_ENABLED = false;
