# Regras de Negócio - DouttorOculos

## 1. Cadastro de Clientes

### 1.1 Dados Obrigatórios
- **Nome completo** - Não pode estar vazio
- **CPF** - Validação de formato e unicidade no sistema
- **Telefone** - Pelo menos um contato
- **Email** - Opcional, mas recomendado para comunicações

### 1.2 Dados Opcionais
- Data de nascimento
- Endereço completo (logradouro, número, complemento, bairro, cidade, estado, CEP)
- Informações de contato adicional
- Observações especiais

### 1.3 Histórico de Cliente
- Histórico completo de transações e receitas vinculadas
- Acesso ao histórico de compras anterior
- Data de último atendimento
- Valor total gasto no estabelecimento

### 1.4 Status do Cliente
- **Ativo**: Cliente com compras ou atividades recentes
- **Inativo**: Sem movimentação há 12 meses
- **Bloqueado**: Cliente com débito em aberto (decisão gerencial)

---

## 2. Receitas Oftalmológicas

### 2.1 Estrutura da Receita

#### Olho Direito (OD) e Olho Esquerdo (OE)
- **Esfera (Esf)**: Valor entre -20.00 e +20.00 dioptrias
- **Cilindro (Cil)**: Valor entre -6.00 e 0.00 dioptrias (miopia) ou 0.00 e +6.00 (hipermetropia)
- **Eixo (Eixo)**: Valor entre 0° e 180°
- **Adição (Add)**: Para presbiopia, valores típicos 0.25 a 3.50
- **Distância Pupilar (DNP)**: Distância entre as pupilas em milímetros

### 2.2 Validações Obrigatórias
- Pelo menos um olho deve ter prescrição (OD ou OE)
- Valores de esfera, cilindro e eixo devem estar dentro dos limites permitidos
- Se houver adição, deve ser positiva
- Distância pupilar deve estar entre 50mm e 75mm (se informada)

### 2.3 Campos Adicionais
- **Data da Receita**: Data em que foi emitida
- **Profissional (Ótico/Oftalmologista)**: Quem emitiu
- **Validade**: 1 ano a partir da data de emissão (configurável por política)
- **Observações**: Anotações especiais (ex: uso específico, materiais preferidos)

### 2.4 Controle de Acesso à Receita
- **Acesso permitido por**: 
  - Ótico responsável
  - Gerente da loja
  - Cliente (somente sua própria receita)
- **Proibido**: Acesso por vendedores ou atendentes não autorizados

### 2.5 Validade e Expiração
- **Prazo padrão**: 1 ano
- **Receita expirada**: Sistema deve alertar ao vender óculos
- **Renovação**: Cliente pode renovar receita junto a novo exame
- **Auditoria**: Log de quem acessou a receita e quando

---

## 3. Cadastro de Produtos

### 3.1 Categorias Permitidas
1. **Armação** - Estrutura do óculos
2. **Lente** - Vidro/Plástico oftálmico
3. **Solução** - Líquidos de limpeza, higiene e conservação
4. **Acessório** - Estojo, pano, protetor, etc.

### 3.2 Dados Obrigatórios por Categoria

#### Armações
- **Código SKU**: Identificador único e imutável
- **Nome/Modelo**: Ex. "Ray-Ban Clubmaster RB3016"
- **Marca**: Fabricante
- **Cor**: Uma ou mais cores disponíveis
- **Material**: Metal, acetato, misto, etc.
- **Tamanho**: Largura da lente (ex. 50/20/140)
- **Preço de Custo** e **Preço de Venda**

#### Lentes
- **Código SKU**: Único
- **Descrição**: Ex. "Lente Monofocal AR/UV 1.50"
- **Tipo**: Monofocal, Bifocal, Progressiva
- **Índice de Refração**: 1.50, 1.56, 1.61, 1.67, 1.74, etc.
- **Tratamentos**: Anti-reflexo (AR), Proteção UV, Azul, etc.
- **Material**: Mineral, Plástico CR-39, Policarbonato, etc.
- **Preço Custo** e **Preço Venda**

#### Soluções e Acessórios
- **Código SKU**
- **Nome do Produto**
- **Marca**
- **Embalagem**: Tamanho/volume
- **Preço Custo** e **Preço Venda**

### 3.3 Validações Globais
- **SKU não pode duplicar** dentro do sistema
- **Preço de venda sempre > preço de custo** (margem mínima configurável)
- **Descrição deve ter no mínimo 10 caracteres**
- **Imagem do produto** é opcional mas recomendada

### 3.4 Status do Produto
- **Ativo**: Disponível para venda
- **Inativo**: Desativado (soft delete, não aparece em vendas)
- **Descontinuado**: Marcado como fora de linha

---

## 4. Controle de Estoque

### 4.1 Operações de Estoque
- **Entrada**: Compra de fornecedor (com NF)
- **Saída**: Venda para cliente
- **Ajuste**: Correção de inventário (dano, extravio, devolução)
- **Transferência**: Entre lojas (se multi-filial)

### 4.2 Alertas de Reposição
- **Estoque Mínimo**: Configurável por produto (padrão: 5 unidades)
- **Alerta Crítico**: Quando estoque ≤ mínimo
- **Aviso**: Notificação ao gerente e sistema de compra
- **Limite de Encomenda**: Quantidade sugerida para reposição

### 4.3 Rastreamento
- **Histórico completo** de movimentações (entrada, saída, ajuste)
- **Data e hora** de cada movimentação
- **Usuário responsável** pela operação
- **Motivo** da movimentação (venda, devolução, perda, etc.)
- **Número de NF** (se aplicável)

### 4.4 Relatório de Estoque
- **Estoque atual** por produto
- **Produtos com estoque baixo**
- **Produtos parados** (sem movimento há 6 meses)
- **Valor total investido em estoque**

### 4.5 Validade (Para Soluções)
- **Data de fabricação** e **Data de vencimento**
- **Alerta**: Produtos próximos do vencimento (30 dias antes)
- **Bloquear venda**: Produtos já vencidos

---

## 5. Gestão de Vendas

### 5.1 Tipos de Venda
1. **Venda Direta**: Pronto pagamento ou parcelado
2. **Orçamento**: Proposta sem compromisso (válido 7 dias)
3. **Pedido Sob Medida**: Óculos com lentes personalizadas
4. **Garantia/Troca**: Produtos com defeito

### 5.2 Fluxo de Venda
```
1. Seleção de Produtos → Confirmação de Receita (se necessário)
2. Geração de Orçamento
3. Aprovação do Cliente
4. Confirmação de Pagamento
5. Preparação do Pedido
6. Entrega/Retirada
7. Emissão de NF (se necessário)
```

### 5.3 Formas de Pagamento
- **Dinheiro**: Recebimento imediato
- **Débito**: Até 24h de compensação
- **Crédito**: Parcelamento (1x a 12x, configurável)
- **PIX**: Até 1 min de confirmação
- **Vale**: Crédito em conta (para cliente recorrente)
- **Cheque**: Com data ou à vista

### 5.4 Descontos
- **Desconto por cliente**: Categoria de desconto (VIP, regular, ocasional)
- **Desconto por produto**: Margem diferenciada por categoria
- **Desconto por volume**: Desconto progressivo
- **Limite de desconto**: Autorização por gerente

### 5.5 Parcelamento
- **Número de parcelas**: Até 12x (configurável)
- **Taxa de juros**: Se aplicável
- **Forma de registro**: Sistema de crediário ou operadora de cartão
- **Acompanhamento**: Status de pagamento de cada parcela

### 5.6 Status da Venda
- **Orçamento**: Proposta emitida, não faturada
- **Pendente**: Aguardando pagamento/confirmação
- **Concluída**: Produto entregue e pago
- **Cancelada**: Anulada (com motivo)
- **Devolvida**: Cliente solicitou devolução (dentro do prazo legal)

---

## 6. Pedidos Sob Medida

### 6.1 Fluxo Especial
1. **Coleta de Medidas**: DNP, altura do aro, distância ao solo
2. **Seleção de Armação e Lente**: Com base em receita
3. **Orçamento Personalizado**: Com prazos de fabricação
4. **Aprovação do Cliente**: Assinatura de contrato (se necessário)
5. **Envio para Laboratório**: Terceirizado ou interno
6. **Notificação de Pronto**: Avisar cliente (WhatsApp/Email)
7. **Entrega e Verificação**: Teste visual do cliente
8. **Garantia**: Período de 30 dias para ajustes

### 6.2 Prazos
- **Padrão**: 5-7 dias úteis
- **Express**: 2-3 dias úteis (com sobretaxa)
- **Pausa de Produção**: Não aceitar pedidos em datas específicas

### 6.3 Rastreamento
- **Status do pedido**: Enviado, em produção, pronto, entregue
- **Notificações automáticas** ao cliente em cada etapa

---

## 7. Financeiro

### 7.1 Contas a Receber
- **Registro de vendas com prazo** (parcelado ou crediário)
- **Acompanhamento de parcelas**: Vencidas, próximas ao vencimento, recebidas
- **Juros por atraso**: Configurável (ex. 2% ao mês)
- **Multa por atraso**: Configurável (ex. 10% sobre débito)
- **Cobrança**: Manual ou automática (integração com SMS/WhatsApp)

### 7.2 Contas a Pagar
- **Registro de compras de fornecedores**
- **Controle de vencimento** e lembretes
- **Integração com contas bancárias** (se possível)
- **Relatório de fluxo de caixa**

### 7.3 Relatório de Faturamento
- **Faturamento total**: Diário, semanal, mensal, anual
- **Ticket médio**: Valor médio por venda
- **Faturamento por produto/categoria**
- **Faturamento por forma de pagamento**
- **Faturamento por vendedor**
- **Comparativo com períodos anteriores**

### 7.4 Comissão de Vendedor
- **Percentual configurável** por categoria ou total
- **Cálculo automático** ao finalizar venda
- **Relatório de comissões** por período
- **Pagamento**: Mensal ou conforme política

---

## 8. Relatórios Gerenciais

### 8.1 Vendas
- **Vendas por período**: Diário, semanal, mensal, anual
- **Produtos mais vendidos**: Top 10
- **Clientes que mais compraram**: Top 10
- **Ticket médio**: Por período ou por vendedor
- **Taxa de conversão**: Orçamentos → Vendas

### 8.2 Estoque
- **Produtos em falta**
- **Produtos parados**: Sem movimento há 6 meses
- **Valor investido em estoque**
- **Custo total vs. Valor de venda**
- **Margem de lucro** por categoria

### 8.3 Financeiro
- **Fluxo de caixa**: Entradas e saídas
- **Contas a receber**: Vencidas, próximas, ok
- **Contas a pagar**: Próximas ao vencimento
- **Lucratividade**: Por produto, por período, por vendedor
- **Inadimplência**: Clientes com débito

### 8.4 Performance
- **Ranking de vendedores**: Por quantidade e valor
- **Comissões a pagar**: Por período
- **Produtos com melhor margem**
- **Clientes recorrentes**: Taxa de retorno

### 8.5 Exportação
- **PDF** para impressão
- **Excel** para análise
- **Email automático** de relatórios (programável)

---

## 9. Segurança e Compliance (LGPD)

### 9.1 Controle de Acesso
- **Autenticação**: Usuário e senha com hash bcrypt (12 salt rounds)
- **2FA (Autenticação de Dois Fatores)**: Opcional, recomendado para gerentes
- **Permissões por perfil**:
  - **Gerente**: Acesso total + aprovação de descontos
  - **Vendedor**: Vendas, consulta de estoque, visualizar receitas (clientes)
  - **Ótico**: Gestão de receitas, orientações sobre lentes
  - **Atendente**: Cadastro básico, agendamentos, consultas

### 9.2 Proteção de Dados
- **CPF**: Criptografia AES-256 em repouso
- **Senhas**: Nunca armazenar em texto plano
- **Dados pessoais**: Acesso restrito a usuários autorizados
- **HTTPS/TLS 1.3**: Obrigatório em produção
- **API com rate limiting**: 100 req/min por IP

### 9.3 Logs de Auditoria
- **Todas as operações críticas** são registradas:
  - Login/logout
  - Vendas e alterações
  - Acesso a receitas
  - Alteração de dados de cliente
  - Descontos aplicados
  - Exclusões/soft deletes
- **Rastreamento**: Quem fez, quando, de onde, e qual mudança

### 9.4 Direitos do Titular (LGPD)
- **Direito de acesso**: Cliente pode solicitar seus dados
- **Direito ao esquecimento**: Soft delete com período de retenção
- **Portabilidade**: Exportação em formato aberto
- **Retificação**: Cliente pode corrigir dados cadastrais
- **Consentimento**: Explícito antes de coletar dados

### 9.5 Backup e Recuperação
- **Backup automático**: Diário (incremental) + Semanal (completo)
- **Retenção**: Mínimo 30 dias
- **Criptografia**: Backups armazenados em local seguro
- **Teste de restauração**: Mensal
- **RTO**: 24 horas (Recovery Time Objective)
- **RPO**: 1 hora (Recovery Point Objective)

### 9.6 Conformidade
- ✅ **LGPD**: Proteção de dados pessoais (brasileira)
- ✅ **PCI DSS**: Se processar cartão de crédito (padrão de segurança)
- ✅ **NF-e**: Emissão de nota fiscal eletrônica (se obrigatório)

---

## 10. Integrações Opcionais

### 10.1 WhatsApp
- **Confirmação de vendas**: Mensagem automática após compra
- **Aviso de pronto**: Pedido sob medida está pronto
- **Lembrete de pagamento**: Parcela próxima ao vencimento
- **Newsletter**: Promoções e campanhas

### 10.2 Email
- **Notificações**: Semelhante ao WhatsApp
- **Relatórios**: Envio automático para gerentes
- **Backup**: Cópia de documentos importantes

### 10.3 Documentos Fiscais
- **Integração NF-e**: Se obrigatório na região
- **Integração CFe** (PDV): Se usar SAT ou ECF
- **Emissão automática**: Ao finalizar venda

### 10.4 Sistema de Pagamento
- **Operadora de cartão**: Integração para autorização online
- **Gateway PIX**: Para transações instantâneas
- **Boleto**: Se venda para empresas

### 10.5 Laboratório Terceirizado
- **API de rastreamento**: Acompanhar status de pedidos
- **Troca de dados**: Especificações de lente via integração

---

## 11. Políticas Gerenciais

### 11.1 Política de Devolução
- **Prazo**: 7-30 dias (configurável)
- **Motivo válido**: Defeito, erro na receita, desgosto
- **Reembolso**: Total ou parcial conforme motivo
- **Registro**: Toda devolução documentada

### 11.2 Política de Garantia
- **Armação**: 1 ano contra defeito de fabricação
- **Lente**: 1 ano (scratches não cobertos)
- **Acessório**: 6 meses
- **Serviço**: Reparos gratuitos durante vigência

### 11.3 Política de Sigilo
- **Receita oftalmológica**: Sigilo profissional garantido
- **Dados financeiros**: Não compartilhados sem autorização
- **Histórico de compra**: Privado do cliente

---

## 12. Workflow de Notificações

### 12.1 Automáticas para Cliente
- ✉️ Confirmação de compra
- ✉️ Pedido sob medida pronto
- ✉️ Lembrete de pagamento em atraso
- ✉️ Receita próxima ao vencimento

### 12.2 Automáticas para Gerente
- 📊 Fim de expediente: Resumo de vendas
- 📊 Produtos com estoque baixo
- 📊 Clientes inadimplentes
- 📊 Metas atingidas/não atingidas

---

## 13. Configurações Padrão (Customizáveis)

| Parâmetro | Valor Padrão | Observação |
|-----------|--------------|-----------|
| Estoque Mínimo | 5 unidades | Por produto |
| Validade da Receita | 1 ano | Ótica responsável |
| Prazo de Entrega Padrão | 5-7 dias | Pedido sob medida |
| Prazo de Devolução | 7 dias | Após entrega |
| Taxa de Juros | 0% | Se parcelado |
| Multa por Atraso | 10% | Sobre débito |
| Juros por Atraso | 2% ao mês | Configurável |
| Margem Mínima | 20% | Por categoria |
| Limite de Desconto Vendedor | 10% | Sem autorização |

---

**Aprovação**: Documento em versão 1.0 - Sujeito a revisões conforme feedback dos usuários finais.
