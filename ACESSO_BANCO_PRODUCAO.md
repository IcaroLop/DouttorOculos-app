# 🔐 Acesso ao Banco de Dados em Produção (SaveInCloud)

## ⚠️ Problema
O MySQL em produção **bloqueia acesso direto** na porta 3306. É necessário usar **SSH Tunnel**.

## ✅ Solução: SSH Tunnel

### **Passo 1: Configurar Chave SSH**

Cada desenvolvedor deve adicionar sua **chave pública SSH** no painel do SaveInCloud:

1. Gerar chave SSH (se não tiver):
   ```bash
   # Windows (PowerShell)
   ssh-keygen -t rsa -b 4096 -f "$HOME\.ssh\id_rsa_douttoroculos"
   
   # Linux/Mac
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_douttoroculos
   ```

2. Copiar conteúdo da chave pública:
   ```bash
   # Windows
   Get-Content "$HOME\.ssh\id_rsa_douttoroculos.pub"
   
   # Linux/Mac
   cat ~/.ssh/id_rsa_douttoroculos.pub
   ```

3. Adicionar no painel SaveInCloud:
   - Acessar: https://paas.saveincloud.net.br
   - Ir em **Configurações > Chaves Públicas**
   - Colar a chave pública

---

### **Passo 2: Iniciar SSH Tunnel**

Execute **antes** de rodar o backend:

#### **Windows:**
```powershell
.\start-ssh-tunnel.ps1
```

#### **Linux/Mac:**
```bash
chmod +x start-ssh-tunnel.sh
./start-ssh-tunnel.sh
```

**O que acontece:**
- Cria um "túnel" do seu `localhost:3307` para o MySQL interno `10.100.48.197:3306`
- Aplicação conecta em `127.0.0.1:3307` (local) que redireciona para o MySQL remoto
- **Deixe a janela do tunnel ABERTA** enquanto desenvolve

---

### **Passo 3: Configurar `.env`**

O `.env` já está configurado para usar o tunnel:

```env
DB_HOST=127.0.0.1
DB_PORT=3307  # Porta local do tunnel
DB_USER=root
DB_PASSWORD=fBVhh6w2KW
DB_NAME=bolaovip
```

---

### **Passo 4: Rodar Backend**

Em **outra janela de terminal** (mantenha o tunnel ativo):

```bash
cd D:\DouttorOculos\backend
npm run dev
```

---

## 🔄 Workflow Diário

```bash
# Terminal 1: Iniciar SSH Tunnel (deixar aberto)
.\start-ssh-tunnel.ps1

# Terminal 2: Rodar backend
cd backend
npm run dev

# Terminal 3: Rodar frontend
cd frontend-web
npm run dev
```

---

## 🛠️ Troubleshooting

### Erro: "Permission denied (publickey)"
- Chave SSH não configurada no SaveInCloud
- Verifique se adicionou a chave pública correta

### Erro: "Port 3307 already in use"
- Tunnel já está rodando em outra janela
- Ou feche a outra janela ou use `taskkill /F /IM ssh.exe` (Windows)

### Erro: "Connection refused"
- Tunnel não está ativo
- Inicie o script `start-ssh-tunnel.ps1`

---

## 📊 Credenciais de Acesso

| Parâmetro | Valor |
|-----------|-------|
| **SSH Host** | gate.paas.saveincloud.net.br |
| **SSH Porta** | 3022 |
| **SSH Usuário** | 254240-8187 |
| **MySQL Interno** | 10.100.48.197:3306 |
| **MySQL User** | root |
| **MySQL Password** | fBVhh6w2KW |
| **Database** | bolaovip |
| **Tunnel Local** | 127.0.0.1:3307 |

---

## 🔒 Segurança

- ✅ Nunca commitar arquivos `.env` com credenciais
- ✅ Cada desenvolvedor usa sua própria chave SSH
- ✅ Credenciais de produção **somente** em variáveis de ambiente
- ✅ Tunnel criptografa toda comunicação com o banco

---

## 🚀 Para Produção (Deploy)

Em produção, o backend roda **dentro** do ambiente SaveInCloud e acessa o MySQL diretamente pela rede interna:

```env
DB_HOST=10.100.48.197
DB_PORT=3306
```

**Não precisa** de SSH tunnel quando rodando no servidor.
