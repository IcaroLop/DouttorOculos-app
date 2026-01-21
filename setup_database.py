#!/usr/bin/env python3
"""
Script para criar database 'douttoroculos' e schema completo
DouttorOculos - Sistema de Gerenciamento de Óticas
"""

import paramiko
import time
import os

# Configurações
SSH_HOST = "gate.paas.saveincloud.net.br"
SSH_PORT = 3022
SSH_USER = "8187"
SSH_KEY_PATH = os.path.expanduser("~/.ssh/id_rsa_douttoroculos")

MYSQL_USER = "root"
MYSQL_PASS = "fBVhh6w2KW"
DB_NAME = "douttoroculos"

# SQL para criação do database e schema
CREATE_DATABASE = f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

CREATE_TABLES = f"""
USE {DB_NAME};

-- Tabela de Lojas
CREATE TABLE IF NOT EXISTS lojas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  cargo ENUM('gerente', 'vendedor', 'otico', 'atendente') NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE,
  data_nascimento DATE,
  endereco TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  codigo_sku VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria ENUM('armacao', 'lente', 'solucao', 'acessorio'),
  preco_custo DECIMAL(10, 2),
  preco_venda DECIMAL(10, 2) NOT NULL,
  estoque INT DEFAULT 0,
  imagem_url VARCHAR(500),
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Vendas
CREATE TABLE IF NOT EXISTS vendas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  cliente_id INT,
  vendedor_id INT NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  desconto DECIMAL(12, 2) DEFAULT 0,
  metodo_pagamento ENUM('dinheiro', 'credito', 'debito', 'pix') NOT NULL,
  status ENUM('pendente', 'concluida', 'cancelada') DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE RESTRICT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Itens de Venda
CREATE TABLE IF NOT EXISTS itens_venda (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venda_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Receitas Oftalmológicas
CREATE TABLE IF NOT EXISTS receitas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  cliente_id INT NOT NULL,
  otico_id INT NOT NULL,
  data_receita DATE NOT NULL,
  esfera_od DECIMAL(5, 2),
  cilindro_od DECIMAL(5, 2),
  eixo_od INT,
  esfera_oe DECIMAL(5, 2),
  cilindro_oe DECIMAL(5, 2),
  eixo_oe INT,
  adicao DECIMAL(5, 2),
  distancia_pupilar INT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id) ON DELETE RESTRICT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  FOREIGN KEY (otico_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para Performance
CREATE INDEX idx_usuario_loja ON usuarios(loja_id);
CREATE INDEX idx_cliente_loja ON clientes(loja_id);
CREATE INDEX idx_produto_loja ON produtos(loja_id);
CREATE INDEX idx_venda_loja ON vendas(loja_id);
CREATE INDEX idx_venda_cliente ON vendas(cliente_id);
CREATE INDEX idx_receita_cliente ON receitas(cliente_id);
CREATE INDEX idx_produto_sku ON produtos(codigo_sku);
CREATE INDEX idx_usuario_email ON usuarios(email);
"""

def connect_ssh():
    """Estabelece conexão SSH"""
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        private_key = paramiko.RSAKey.from_private_key_file(SSH_KEY_PATH)
        
        print("🔄 Conectando ao SSH Gate...")
        client.connect(
            hostname=SSH_HOST,
            port=SSH_PORT,
            username=SSH_USER,
            pkey=private_key,
            timeout=10
        )
        
        return client
    except Exception as e:
        print(f"❌ Erro na conexão SSH: {e}")
        return None

def execute_mysql(client, sql, description):
    """Executa SQL via SSH"""
    try:
        channel = client.invoke_shell()
        time.sleep(2)
        
        # Lê menu e seleciona ambiente
        while channel.recv_ready():
            channel.recv(4096)
        
        channel.send("3\n")  # Ambiente bolaovip-cs-backend
        time.sleep(3)
        
        while channel.recv_ready():
            channel.recv(4096)
        
        channel.send("3\n")  # Container MySQL
        time.sleep(3)
        
        while channel.recv_ready():
            channel.recv(4096)
        
        # Executa SQL
        print(f"📊 {description}...")
        sql_escaped = sql.replace('"', '\\"').replace('$', '\\$')
        mysql_cmd = f'mysql -u {MYSQL_USER} -p"{MYSQL_PASS}" -e "{sql_escaped}"\n'
        channel.send(mysql_cmd)
        time.sleep(5)
        
        # Lê resultado
        result = ""
        while channel.recv_ready():
            result += channel.recv(4096).decode('utf-8')
            time.sleep(0.5)
        
        channel.close()
        return result
        
    except Exception as e:
        print(f"❌ Erro ao executar SQL: {e}")
        return None

def main():
    print("=" * 70)
    print("  Setup Database - DouttorOculos")
    print("=" * 70)
    
    client = connect_ssh()
    if not client:
        return
    
    try:
        # Cria database
        print("\n📦 Criando database 'douttoroculos'...")
        result = execute_mysql(client, CREATE_DATABASE, "Criando database")
        if result:
            print("✅ Database criado com sucesso!")
        
        # Aguarda e reconecta
        time.sleep(2)
        
        # Cria tabelas
        print("\n📋 Criando tabelas...")
        result = execute_mysql(client, CREATE_TABLES, "Criando schema completo")
        if result:
            print("✅ Schema criado com sucesso!")
        
        # Verifica tabelas criadas
        print("\n📊 Verificando tabelas criadas...")
        client2 = connect_ssh()
        if client2:
            verify_sql = f"USE {DB_NAME}; SHOW TABLES;"
            result = execute_mysql(client2, verify_sql, "Listando tabelas")
            if result:
                print("\n" + result)
            client2.close()
        
    finally:
        client.close()
        print("\n✅ Setup concluído!")

if __name__ == "__main__":
    main()
