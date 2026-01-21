# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && \
    npm ci --only=development

# Copiar código fonte
COPY tsconfig.json ./
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar dumb-init para melhor gerenciamento de processos
RUN apk add --no-cache dumb-init

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar arquivos compilados do builder
COPY --from=builder /app/dist ./dist

# Criar diretório de logs
RUN mkdir -p /app/logs

# Definir user não-root por segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

# Usar dumb-init para executar o processo
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
