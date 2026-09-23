# Lista de Tarefas — Web (Admin)

React + TypeScript + Vite. Consome a API do backend Spring Boot
(`ec2-backend-lista-tarefas`).

## Rodando localmente

```bash
npm install
cp .env.example .env
# edite .env com a URL real do backend (local ou da EC2)
npm run dev
```

Abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
```

Gera a pasta `dist/` com arquivos estáticos — é isso que o `Dockerfile`
abaixo deve servir via Nginx (compatível com a stack `ec2-frontend` que já
existe na infra Terraform).

## Dockerfile sugerido (para a stack ec2-frontend)

Crie um `Dockerfile` na raiz deste projeto:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Depois, no `terraform.tfvars` da stack `ec2-frontend-lista-tarefas`,
preencha `frontend_repo_url` com a URL deste repositório — o `user_data`
já faz `docker compose up -d --build` automaticamente.

## Estrutura

```
src/
├── api/          # cliente axios + funções de chamada à API
├── types/        # tipos TypeScript alinhados ao schema do banco
├── components/   # TaskCard, EvaluateModal, RankingPanel
└── pages/        # Login, Dashboard, Catalog, FamilyMemberForm
```

## Endpoints que o backend precisa implementar

Ver `src/api/tarefas.ts` para a lista completa de chamadas esperadas
(login, tasks CRUD, avaliar, task-templates, stats, ranking, users,
graus-parentesco).
