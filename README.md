# Dossiê Paranormal — servidor

Criador de fichas de Ordem Paranormal RPG com Sobrevivendo ao Horror, Arquivos Secretos, regras opcionais, condições, interlúdio, bônus e homebrew. Esta pasta roda como um site próprio, com contas de usuário e banco de dados SQLite.

## Requisitos

- Node.js **22.13 ou mais novo** (o banco usa o SQLite que já vem no Node; não há `npm install`).

## Rodar

```bash
npm start
```

Abra `http://localhost:3000`. Clique em **Entrar** → escolha um nome e uma senha → **Criar conta**. As fichas que já estavam no navegador vão junto para a conta nova.

## Configuração (variáveis de ambiente)

| Variável | Padrão | Para quê |
|---|---|---|
| `PORT` | `3000` | Porta do servidor |
| `DB_PATH` | `server/dados/dossie.db` | Arquivo do banco SQLite |
| `PERMITIR_CADASTRO` | `1` | `0` desliga a criação de contas novas (depois que o grupo se cadastrar) |
| `COOKIE_SECURE` | — | `1` quando o site estiver em HTTPS |
| `NODE_ENV` | — | `production` guarda a página em cache |

Exemplo: `PORT=8080 PERMITIR_CADASTRO=0 npm start`

## Docker

```bash
docker build -t dossie .
docker run -d -p 3000:3000 -v dossie-dados:/dados --name dossie dossie
```

O banco fica no volume `dossie-dados`, então sobrevive a atualizações do container.

## Colocar na internet

Qualquer serviço que rode Node.js ou Docker com disco persistente serve (VPS, Railway, Fly.io, Render com disco). Use HTTPS na frente (o próprio serviço ou um proxy como Caddy/Nginx) e defina `COOKIE_SECURE=1`.

## Backup

Tudo está em um único arquivo: `server/dados/dossie.db` (ou o `DB_PATH` escolhido). Copie esse arquivo com o servidor parado, ou use `sqlite3 dossie.db ".backup copia.db"` com ele rodando. Cada pessoa também pode exportar um backup em JSON pelo próprio app.

## O que fica guardado

- `usuarios`: nome e senha (com hash scrypt; a senha nunca é salva em texto).
- `sessoes`: logins ativos (30 dias).
- `docs`: fichas, homebrew e configurações da mesa de cada pessoa. Cada conta só vê os próprios dados.
- `mesas`, `mesa_membros`, `mesa_eventos`: campanhas, quem participa (mestre ou jogador) e os últimos 200 avisos de rituais de cada campanha.
- `imagens`: imagens anexadas a itens e NPCs (até 8 MB cada; PNG, JPG, GIF ou WebP).

## Campanha compartilhada

1. O mestre entra, abre **Campanha**, cria uma campanha e passa o código.
2. Cada jogador entra com o código e, no Dossiê de cada agente, escolhe a campanha no campo **Campanha**.
3. Só o mestre vê as fichas ligadas (somente leitura) e os avisos de rituais (DT, teste de resistência e efeito). Jogadores veem apenas as próprias fichas.

## Estrutura

```
index.html        página do app
js/               código do app
data/dados.json   conteúdo dos livros (gerado por build.js a partir de src/)
server/server.js  servidor HTTP + API + SQLite
```

API (usada pelo app): `GET /api/eu`, `POST /api/cadastrar`, `POST /api/entrar`, `POST /api/sair`, `GET /api/docs`, `PUT/DELETE /api/docs/:id`, `POST /api/imagens`, `GET /_blob/:id`, `GET/POST /api/mesas`, `POST /api/mesas/entrar`, `DELETE /api/mesas/:id`, `POST /api/mesas/:id/sair`, `GET /api/mesas/:id/fichas` (só mestre), `GET/POST /api/mesas/:id/eventos`.
