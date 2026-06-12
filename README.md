# Grana Limpa

Educador financeiro que faz uma simulação rápida da sua vida financeira e devolve
um diagnóstico com recomendações e próximos passos. As respostas ficam salvas no
próprio navegador (localStorage) e dá pra tirar dúvidas num chat.

A análise usa a API do Google Gemini. Se não houver chave configurada, o app cai
num modo offline que calcula o diagnóstico por uma heurística local — ou seja,
funciona mesmo sem a IA.

## Stack

- React + TypeScript (Vite)
- Tailwind CSS v4
- React Router
- Google Gemini (via REST)

## Rodando

```bash
npm install
npm run dev
```

## Configurando a IA (opcional)

1. Gere uma chave em https://aistudio.google.com/apikey
2. Copie o `.env.example` para `.env`
3. Cole a chave em `VITE_GEMINI_API_KEY`

```bash
cp .env.example .env
```

Sem isso o app roda normalmente no modo offline.

## Estrutura

```
src/
  components/   componentes de UI (botão, header, form, chat...)
  context/      tema claro/escuro
  pages/        início, simulação, resultado, histórico
  services/     gemini, prompt, heurística, localStorage
  types/        tipos do domínio
  utils/        máscara de moeda, ids
```

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — serve o build localmente
