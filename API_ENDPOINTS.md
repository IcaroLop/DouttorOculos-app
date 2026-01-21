# API Endpoints - DouttorOculos

**Base URL:** `http://localhost:3000/api/v1`  
**Auth:** Header `Authorization: Bearer {accessToken}`  
**Multi-tenant:** Header `x-portal: {portal}`

---

## 🔐 Autenticação

### POST /auth/login
Autenticar usuário e obter tokens JWT.

**Request:**
```json
{
  "portal": "default",
  "username": "admin",
  "password": "123456"
}
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@douttoroculos.com",
    "cargo": "gerente",
    "portal": "default"
  }
}
```

**Errors:**
- 400: Portal, usuário e senha são obrigatórios
- 401: Credenciais inválidas

---

### POST /auth/refresh
Renovar access token usando refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

## 👤 Clientes

### POST /clientes
Criar novo cliente.

**Request:**
```json
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "telefone": "11987654321",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-15",
  "endereco": "Rua A, 123, São Paulo - SP"
}
```

**Validation:**
- `nome`: string, min 3, max 255, obrigatório
- `cpf`: string, regex /^\d{11}$/, obrigatório, único
- `telefone`: string, min 10, max 20, obrigatório
- `email`: string, email válido, opcional

**Response 201:**
```json
{
  "id": 1,
  "lojaId": 1,
  "nome": "João Silva",
  "cpf": "12345678901",
  "telefone": "11987654321",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-15T00:00:00.000Z",
  "endereco": "Rua A, 123, São Paulo - SP",
  "ativo": true,
  "criadoEm": "2026-01-21T10:30:00.000Z"
}
```

---

### GET /clientes
Listar clientes com paginação.

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response 200:**
```json
{
  "data": [...],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

---

### GET /clientes/:id
Obter cliente por ID.

**Response 200:** Objeto cliente  
**Response 404:** Cliente não encontrado

---

### PUT /clientes/:id
Atualizar cliente.

**Request:** Mesmos campos do POST (todos opcionais)

**Response 200:** Objeto cliente atualizado

---

### DELETE /clientes/:id
Deletar cliente (soft delete).

**Response 204:** No Content

---

## 📦 Produtos

### POST /produtos
Criar novo produto.

**Request:**
```json
{
  "codigoSku": "ARM-001",
  "nome": "Armação Ray-Ban Clubmaster",
  "descricao": "Armação em acetato premium",
  "categoria": "armacao",
  "precoCusto": 150.00,
  "precoVenda": 299.90,
  "estoque": 20,
  "estoqueMinimo": 5,
  "imagemUrl": "https://exemplo.com/imagem.jpg"
}
```

**Validation:**
- `codigoSku`: string, min 3, max 50, obrigatório, único
- `categoria`: enum ['armacao', 'lente', 'solucao', 'acessorio']
- `precoVenda`: number, positivo, > precoCusto
- `estoque`: number, >= 0

**Response 201:** Objeto produto

---

### GET /produtos
Listar produtos.

**Query Params:**
- `page`, `limit` (paginação)
- `categoria` (filtro)
- `ativo` (boolean)

---

### GET /produtos/baixo-estoque
Listar produtos com estoque ≤ estoqueMinimo.

**Response 200:**
```json
[
  {
    "id": 3,
    "nome": "Lente Transitions",
    "estoque": 2,
    "estoqueMinimo": 5
  }
]
```

---

### PUT /produtos/:id
Atualizar produto.

---

### DELETE /produtos/:id
Deletar produto (soft delete).

---

## 👓 Receitas

### POST /receitas
Criar receita oftalmológica.

**Request:**
```json
{
  "clienteId": 1,
  "oticoId": 2,
  "dataReceita": "2026-01-20",
  "esferaOd": -2.50,
  "cilindroOd": -0.75,
  "eixoOd": 90,
  "esferaOe": -2.25,
  "cilindroOe": -1.00,
  "eixoOe": 85,
  "adicao": 1.50,
  "distanciaPupilar": 63,
  "observacoes": "Uso contínuo"
}
```

**Validation:**
- Pelo menos um olho (OD ou OE) obrigatório
- `esfera*`: -20 a +20
- `cilindro*`: -6 a +6
- `eixo*`: 0 a 180
- `distanciaPupilar`: 50 a 75 (se fornecido)

**Response 201:** Objeto receita

---

### GET /receitas/cliente/:clienteId
Listar receitas de um cliente.

---

### GET /receitas/:id/validade
Verificar se receita está válida (1 ano).

**Response 200:**
```json
{
  "valida": true,
  "diasRestantes": 245
}
```

---

### GET /receitas/proximasAoVencimento
Listar receitas com vencimento em até 30 dias.

**Query Params:**
- `dias` (default: 30)

---

## 💰 Vendas

### POST /vendas
Criar venda com itens.

**Request:**
```json
{
  "clienteId": 1,
  "vendedorId": 2,
  "total": 599.80,
  "desconto": 50.00,
  "metodoPagamento": "credito",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2,
      "precoUnitario": 299.90
    }
  ]
}
```

**Validation:**
- `metodoPagamento`: enum ['dinheiro', 'credito', 'debito', 'pix']
- `itens`: array não vazio

**Business Rules:**
- Estoque é decrementado automaticamente
- Status inicial: 'pendente'
- Se estoque insuficiente, retorna erro 400

**Response 201:** Objeto venda com itens

---

### GET /vendas
Listar vendas.

**Query Params:**
- `page`, `limit`
- `status` (filtro)

---

### GET /vendas/cliente/:clienteId
Listar vendas de um cliente.

---

### GET /vendas/relatorio/ticket-medio
Calcular ticket médio.

**Query Params:**
- `dataInicio` (ISO date)
- `dataFim` (ISO date)

**Response 200:**
```json
{
  "ticketMedio": 487.50,
  "totalVendas": 12,
  "periodo": {
    "inicio": "2026-01-01",
    "fim": "2026-01-21"
  }
}
```

---

### PUT /vendas/:id/status
Atualizar status da venda.

**Request:**
```json
{
  "status": "concluida"
}
```

**Business Rules:**
- Se status = 'cancelada', estoque é revertido
- Transições válidas: pendente → concluida/cancelada

---

## 🔒 Autenticação & Autorização

### Headers Obrigatórios
Todas as rotas (exceto `/auth/login` e `/auth/refresh`) requerem:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
x-portal: default
```

### Cargos (para implementar guards)
- **gerente**: Acesso total, pode deletar, descontos sem limite
- **vendedor**: Criar vendas, consultar estoque
- **otico**: Criar/editar receitas
- **atendente**: Cadastro básico, consultas

---

## ❌ Códigos de Erro

- **400** Bad Request - Validação falhou
- **401** Unauthorized - Token inválido/expirado
- **403** Forbidden - Sem permissão (cargo insuficiente)
- **404** Not Found - Recurso não encontrado
- **409** Conflict - CPF/SKU duplicado
- **500** Internal Server Error

**Formato de erro:**
```json
{
  "message": "CPF já cadastrado",
  "status": 400
}
```

---

## 📝 Notas

1. **Multi-tenancy:** Todas as queries filtram por `lojaId` (mapeado do header `x-portal`)
2. **Soft Delete:** DELETE retorna 204 mas seta `ativo = FALSE`
3. **Paginação:** Padrão page=1, limit=10
4. **Datas:** ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
5. **Moeda:** Números decimais (ex: 299.90)

---

**Última atualização:** 21 Jan 2026
