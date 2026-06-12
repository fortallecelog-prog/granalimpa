# Grana Limpa

Criei o Grana Limpa pra resolver uma dor que eu via em todo mundo perto de mim: a
pessoa sabe que precisa "se organizar financeiramente", mas trava na hora de
entender onde está pisando. Planilha assusta, consultoria é cara e os apps de banco
só mostram o extrato — não dizem o que fazer com ele.

A ideia aqui é simples: você responde cinco perguntas sobre a sua vida financeira
(renda, gastos fixos, dívidas, reserva e qual o seu objetivo) e recebe de volta um
diagnóstico em linguagem de gente — um score de saúde de 0 a 100, o que está bom, o
que merece atenção e quais os próximos passos concretos. Depois dá pra continuar a
conversa num chat e tirar dúvidas sobre o seu próprio cenário.

Tudo fica guardado no seu navegador. Não tem cadastro, não tem servidor coletando
nada seu — abriu, simulou, é seu.

## Como funciona por dentro

A análise é gerada pela API do Google Gemini, que recebe os números da simulação e
devolve o diagnóstico estruturado. Mas eu não queria que o app quebrasse pra quem
não tem (ou não quer configurar) uma chave de IA, então construí um motor de
heurística próprio: um conjunto de regras baseadas em indicadores financeiros
clássicos (comprometimento de renda, meses de reserva, peso das dívidas) que produz
um diagnóstico coerente sozinho. Sem chave configurada, o app simplesmente entra
nesse modo offline e continua 100% utilizável.

## Stack

Montei com React + TypeScript no Vite, Tailwind CSS v4 pra estilização e React
Router pra navegação. O tema claro/escuro acompanha a preferência do sistema e fica
salvo. A integração com o Gemini é via REST, sem SDK pesado — só o `fetch`.

## Rodando localmente

```bash
npm install
npm run dev
```

A configuração da IA é opcional. Se quiser ligar o Gemini, gere uma chave gratuita no
[Google AI Studio](https://aistudio.google.com/apikey), copie o `.env.example` para
`.env` e cole a chave em `VITE_GEMINI_API_KEY`. Sem isso, o modo offline assume.

## Organização do código

```
src/
  components/   UI: header, formulário, cartões de resultado, chat
  context/      tema claro/escuro
  pages/        início, simulação, resultado, histórico
  services/     gemini, prompts, heurística offline, localStorage
  types/        tipos do domínio
  utils/        máscara de moeda em real, geração de ids
```

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — serve o build localmente

---

Feito por **Gabriel Medeiros Couto**.
