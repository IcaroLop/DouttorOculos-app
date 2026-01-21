# Script para conectar ao MySQL via SSH Tunnel
# DouttorOculos - SaveInCloud

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Conectando ao MySQL - DouttorOculos" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configurações
$sshKey = "$env:USERPROFILE\.ssh\id_rsa_douttoroculos"
$sshUser = "8187"
$sshGate = "gate.paas.saveincloud.net.br"
$sshPort = 3022
$localPort = 13306
$remoteHost = "127.0.0.1"
$remotePort = 3306

# Verifica se já existe um tunnel ativo
$existingTunnel = Get-Process -Name ssh -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*$localPort*" }
if ($existingTunnel) {
    Write-Host "⚠️  Já existe um tunnel SSH ativo na porta $localPort" -ForegroundColor Yellow
    Write-Host "Encerrando tunnel anterior..." -ForegroundColor Yellow
    Stop-Process -Id $existingTunnel.Id -Force
    Start-Sleep -Seconds 2
}

Write-Host "🔄 Estabelecendo SSH Tunnel..." -ForegroundColor Green
Write-Host ""
Write-Host "INSTRUÇÕES:" -ForegroundColor Yellow
Write-Host "1. Quando aparecer o menu, digite: 3" -ForegroundColor White
Write-Host "2. O tunnel ficará ativo em segundo plano" -ForegroundColor White
Write-Host "3. Use: mysql -h 127.0.0.1 -P 13306 -u root -p" -ForegroundColor White
Write-Host ""

# Inicia o SSH tunnel
ssh -i $sshKey -L ${localPort}:${remoteHost}:${remotePort} ${sshUser}@${sshGate} -p $sshPort
