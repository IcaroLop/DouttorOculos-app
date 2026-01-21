#!/usr/bin/env pwsh
# Script para criar SSH Tunnel para o MySQL do SaveInCloud
# Uso: .\start-ssh-tunnel.ps1

$SSH_KEY = "$HOME\.ssh\id_rsa_douttoroculos"
$SSH_USER = "254240-8187"
$SSH_HOST = "gate.paas.saveincloud.net.br"
$SSH_PORT = 3022
$MYSQL_INTERNAL_IP = "10.100.48.197"
$MYSQL_PORT = 3306
$LOCAL_PORT = 3307

Write-Host "Iniciando SSH Tunnel para MySQL..." -ForegroundColor Cyan
Write-Host "   Local: 127.0.0.1:${LOCAL_PORT} -> Remoto: ${MYSQL_INTERNAL_IP}:${MYSQL_PORT}" -ForegroundColor Yellow

# Verificar se chave SSH existe
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "❌ Chave SSH não encontrada: $SSH_KEY" -ForegroundColor Red
    Write-Host "   Execute: ssh-keygen -t rsa -b 4096 -f $SSH_KEY" -ForegroundColor Yellow
    exit 1
}

# Verificar se porta já está em uso
$portInUse = Get-NetTCPConnection -LocalPort $LOCAL_PORT -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Porta $LOCAL_PORT já está em uso. Encerrando conexão anterior..." -ForegroundColor Yellow
    Stop-Process -Id $portInUse.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "🚀 Conectando ao SSH Gateway..." -ForegroundColor Green
Write-Host ""
Write-Host "Instrucoes:" -ForegroundColor Yellow
Write-Host "   1. Quando conectar ao SSH, selecione: 3 (ambiente bolaovip-cs-backend)" -ForegroundColor White
Write-Host "   2. Selecione: 3 (container MySQL CE - nodeid 254240)" -ForegroundColor White
Write-Host "   3. Mantenha esta janela ABERTA enquanto desenvolve" -ForegroundColor White
Write-Host "   4. Para parar: Ctrl+C nesta janela" -ForegroundColor White
Write-Host ""
Write-Host "Apos conectar, use no .env: DB_HOST=127.0.0.1 DB_PORT=3307" -ForegroundColor Green
Write-Host ""

# Criar SSH Tunnel
ssh -i $SSH_KEY `
    -L "${LOCAL_PORT}:${MYSQL_INTERNAL_IP}:${MYSQL_PORT}" `
    "${SSH_USER}@${SSH_HOST}" `
    -p $SSH_PORT `
    -N -v

# Mensagem ao encerrar
Write-Host ""
Write-Host "SSH Tunnel encerrado." -ForegroundColor Red
