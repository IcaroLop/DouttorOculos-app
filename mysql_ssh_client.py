#!/usr/bin/env python3
"""
Cliente MySQL via SSH para DouttorOculos
Conecta ao servidor SaveInCloud e executa queries MySQL
"""

import paramiko
import time
import sys
import os

# Configurações
SSH_HOST = "gate.paas.saveincloud.net.br"
SSH_PORT = 3022
SSH_USER = "8187"
SSH_KEY_PATH = os.path.expanduser("~/.ssh/id_rsa_douttoroculos")
ENV_OPTION = "3"  # bolaovip-cs-backend

MYSQL_USER = "root"
MYSQL_PASS = "fBVhh6w2KW"

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

def execute_mysql_query(client, query):
    """Executa query MySQL via SSH"""
    try:
        # Cria sessão interativa
        channel = client.invoke_shell()
        time.sleep(2)
        
        # Lê menu inicial (seleção de ambiente)
        output = ""
        while channel.recv_ready():
            output += channel.recv(4096).decode('utf-8')
            time.sleep(0.3)
        
        # Seleciona ambiente (opção 3 - bolaovip-cs-backend)
        print(f"✅ Selecionando ambiente {ENV_OPTION}...")
        channel.send(f"{ENV_OPTION}\n")
        time.sleep(3)
        
        # Lê segundo menu (seleção de container)
        output = ""
        while channel.recv_ready():
            output += channel.recv(4096).decode('utf-8')
            time.sleep(0.3)
        
        # Seleciona container MySQL (opção 3 - MySQL CE)
        print(f"✅ Selecionando container MySQL (opção 3)...")
        channel.send("3\n")
        time.sleep(3)
        
        # Aguarda prompt do shell MySQL
        output = ""
        while channel.recv_ready():
            output += channel.recv(4096).decode('utf-8')
            time.sleep(0.3)
        
        # Executa query MySQL
        mysql_cmd = f'mysql -u {MYSQL_USER} -p"{MYSQL_PASS}" -e "{query}"\n'
        print(f"📊 Executando query: {query[:80]}...")
        channel.send(mysql_cmd)
        time.sleep(4)
        
        # Lê resultado completo
        result = ""
        while channel.recv_ready():
            result += channel.recv(4096).decode('utf-8')
            time.sleep(0.5)
        
        channel.close()
        return result
        
    except Exception as e:
        print(f"❌ Erro ao executar query: {e}")
        return None

def main():
    """Função principal"""
    print("=" * 60)
    print("  MySQL Client via SSH - DouttorOculos")
    print("=" * 60)
    
    # Conecta ao SSH
    client = connect_ssh()
    if not client:
        sys.exit(1)
    
    try:
        # Lista bancos de dados
        print("\n" + "=" * 60)
        print("  Listando bancos de dados...")
        print("=" * 60)
        result = execute_mysql_query(client, "SHOW DATABASES;")
        if result:
            print(result)
        
        # Mostra versão do MySQL
        print("\n" + "=" * 60)
        print("  Verificando versão do MySQL...")
        print("=" * 60)
        result = execute_mysql_query(client, "SELECT VERSION() AS MySQL_Version;")
        if result:
            print(result)
            
    finally:
        client.close()
        print("\n✅ Conexão encerrada.")

if __name__ == "__main__":
    main()
