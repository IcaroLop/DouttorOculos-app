import Joi from 'joi';

// Cliente validation schemas
export const createClienteSchema = Joi.object({
  nome: Joi.string().min(3).max(255).required(),
  cpf: Joi.string()
    .regex(/^\d{11}$/)
    .required()
    .messages({ 'string.pattern.base': 'CPF deve conter 11 dígitos' }),
  telefone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().optional().allow(null),
  dataNascimento: Joi.date().optional().allow(null),
  endereco: Joi.string().optional().allow(null),
});

export const updateClienteSchema = createClienteSchema.fork(['cpf'], (schema) => schema.optional());

// Produto validation schemas
export const createProdutoSchema = Joi.object({
  codigoSku: Joi.string().min(3).max(50).required(),
  nome: Joi.string().min(3).max(255).required(),
  descricao: Joi.string().min(10).optional().allow(null),
  categoria: Joi.string().valid('armacao', 'lente', 'solucao', 'acessorio').required(),
  precoCusto: Joi.number().positive().optional().allow(null),
  precoVenda: Joi.number().positive().required(),
  estoque: Joi.number().integer().default(0),
  estoqueMinimo: Joi.number().integer().default(5),
  imagemUrl: Joi.string().uri().optional().allow(null),
}).external(async (value) => {
  // Validação: preço_venda deve ser > preço_custo
  if (value.precoCusto && value.precoVenda <= value.precoCusto) {
    throw new Error('Preço de venda deve ser maior que o preço de custo');
  }
});

export const updateProdutoSchema = createProdutoSchema.fork(['codigoSku'], (schema) => schema.optional());

// Receita validation schemas
export const createReceitaSchema = Joi.object({
  clienteId: Joi.number().integer().positive().required(),
  oticoId: Joi.number().integer().positive().required(),
  dataReceita: Joi.date().required(),
  esferaOd: Joi.number().min(-20).max(20).optional().allow(null),
  cilindroOd: Joi.number().min(-6).max(6).optional().allow(null),
  eixoOd: Joi.number().min(0).max(180).optional().allow(null),
  esferaOe: Joi.number().min(-20).max(20).optional().allow(null),
  cilindroOe: Joi.number().min(-6).max(6).optional().allow(null),
  eixoOe: Joi.number().min(0).max(180).optional().allow(null),
  adicao: Joi.number().min(0).max(3.5).optional().allow(null),
  distanciaPupilar: Joi.number().min(50).max(75).optional().allow(null),
  observacoes: Joi.string().optional().allow(null),
}).external(async (value) => {
  // Validação: pelo menos um olho deve ter prescrição
  const temOD = value.esferaOd !== null && value.esferaOd !== undefined;
  const temOE = value.esferaOe !== null && value.esferaOe !== undefined;
  if (!temOD && !temOE) {
    throw new Error('Pelo menos um olho deve ter prescrição (OD ou OE)');
  }
});

export const updateReceitaSchema = createReceitaSchema.fork(
  ['clienteId', 'oticoId', 'dataReceita'],
  (schema) => schema.optional()
);

// Venda validation schemas
export const createVendaSchema = Joi.object({
  clienteId: Joi.number().integer().positive().optional().allow(null),
  vendedorId: Joi.number().integer().positive().required(),
  total: Joi.number().positive().required(),
  desconto: Joi.number().min(0).default(0),
  metodoPagamento: Joi.string().valid('dinheiro', 'credito', 'debito', 'pix').required(),
  itens: Joi.array()
    .items(
      Joi.object({
        produtoId: Joi.number().integer().positive().required(),
        quantidade: Joi.number().integer().positive().required(),
        precoUnitario: Joi.number().positive().required(),
      })
    )
    .required(),
});

export const updateVendaSchema = Joi.object({
  status: Joi.string().valid('pendente', 'concluida', 'cancelada').required(),
  desconto: Joi.number().min(0).optional(),
});
