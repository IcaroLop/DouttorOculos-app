# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remover default config
RUN rm -rf ./*

# Copiar arquivos compilados do builder
COPY --from=builder /app/dist .

# Copiar nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
