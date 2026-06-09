# 👗 Closet Virtual — Guia de Instalação (Passo a Passo)

Este guia te leva do zero até o app no ar, com try-on realista funcionando.
Não precisa saber programar. Siga na ordem.

---

## 🔐 ANTES DE TUDO: segurança da chave

Se você colou sua chave da FASHN em algum lugar público (chat, etc.),
**revogue ela e gere uma nova** em https://app.fashn.ai/api
Sua chave é como uma senha — nunca a coloque dentro de arquivos que vão para a internet.
Neste projeto, ela fica guardada com segurança na Vercel (Passo 4).

---

## 📦 O que tem nesta pasta

```
closet-app/
├── index.html        ← o aplicativo (a parte visual)
├── api/
│   └── tryon.js      ← o "backend" que conversa com a FASHN em segredo
├── vercel.json       ← configuração técnica (não precisa mexer)
└── LEIA-ME.md        ← este guia
```

---

## PASSO 1 — Criar conta na FASHN e comprar créditos

1. Acesse **https://app.fashn.ai** e crie sua conta
2. Vá em **https://app.fashn.ai/api** e clique em **"Create new API key"**
3. **Copie a chave** e guarde num bloco de notas (você não verá de novo!)
4. Vá em **https://app.fashn.ai/billing** → aba **"FASHN API"** → compre créditos
   (uma recarga pequena, tipo US$ 10, já dá ~130 imagens de teste)

---

## PASSO 2 — Criar conta na Vercel (gratuita)

1. Acesse **https://vercel.com/signup**
2. Crie a conta (pode usar e-mail ou login do Google/GitHub)
3. Confirme o e-mail se pedir

---

## PASSO 3 — Subir o projeto na Vercel

A forma mais fácil, sem instalar nada:

1. Na pasta `closet-app`, compacte tudo num arquivo **.zip**
   (selecione index.html + a pasta api + vercel.json → "Comprimir")
2. No painel da Vercel, clique em **"Add New..."** → **"Project"**
3. Procure a opção de **importar / upload** e arraste o .zip
   - (Se a Vercel pedir um repositório do GitHub, veja a alternativa no fim deste guia)
4. Não clique em "Deploy" ainda! Primeiro faça o Passo 4 abaixo
   (adicionar a chave). Se já fez o deploy, tudo bem — é só adicionar
   a chave depois e clicar em "Redeploy".

---

## PASSO 4 — Guardar sua chave da FASHN com segurança ⭐

Este é o passo mais importante. É aqui que a chave fica protegida.

1. No projeto da Vercel, vá em **Settings** → **Environment Variables**
2. Crie uma nova variável:
   - **Name (nome):** `FASHN_API_KEY`
   - **Value (valor):** cole sua chave da FASHN (a `fa-...`)
3. Clique em **Save**
4. Vá em **Deployments** → nos três pontinhos do último deploy → **Redeploy**

Pronto! A chave agora vive só dentro da Vercel, invisível para qualquer usuário.

---

## PASSO 5 — Conectar o app ao backend

1. Depois do deploy, a Vercel te dá um endereço tipo:
   `https://closet-app-xxxx.vercel.app`
2. Abra o arquivo **index.html** num editor de texto (Bloco de Notas serve)
3. Procure por esta linha (use Ctrl+F):
   ```
   const TRYON_ENDPOINT = '/api/tryon';
   ```
4. Se o app e o backend estão na MESMA Vercel (o caso normal aqui),
   **não precisa mudar nada** — pode deixar `/api/tryon`.
5. Salve e suba de novo se tiver alterado.

---

## ✅ PASSO 6 — Testar!

1. Abra seu endereço da Vercel no navegador
2. Vá na aba **Looks**
3. Clique numa peça do guarda-roupa (que tenha foto)
4. Em "Try-on realista", clique em **"Adicionar minha foto"**
   e envie uma foto sua de **corpo inteiro, de frente, boa iluminação**
5. Clique em **"Gerar try-on realista"**
6. Em ~10-30 segundos aparece você vestindo a peça! 🎉

---

## 💡 Dicas para melhor resultado

- Foto sua: corpo inteiro, de frente, fundo simples, boa luz
- Foto da roupa: peça bem visível, de preferência sozinha (flat-lay ou em cabide)
- Cada geração consome 1 crédito (~US$ 0,075 / ~R$ 0,40)

---

## ❓ Problemas comuns

- **"FASHN_API_KEY não configurada"** → você esqueceu o Passo 4 (variável de ambiente) ou não fez o Redeploy depois
- **"Erro de conexão"** → confira se o endereço em TRYON_ENDPOINT está certo
- **Demora muito / timeout** → tente uma foto menor ou tente de novo
- **Sem créditos** → recarregue em app.fashn.ai/billing

---

## 🔄 Alternativa ao Passo 3 (se a Vercel só aceitar GitHub)

1. Crie conta no GitHub (github.com)
2. Crie um repositório novo
3. Faça upload dos arquivos (index.html, pasta api, vercel.json)
4. Na Vercel, "Add New Project" → importe esse repositório
5. Siga do Passo 4 em diante

Qualquer dúvida, é só perguntar! 😊
