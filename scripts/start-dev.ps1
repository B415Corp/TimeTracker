# PowerShell script для запуска TimeTracker с docker-compose.dev.yml

Write-Host "🚀 Запуск TimeTracker (dev)..." -ForegroundColor Green

$ComposeFile = "docker-compose.dev.yml"

# Проверка наличия Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker не установлен. Пожалуйста, установите Docker Desktop." -ForegroundColor Red
    exit 1
}

# Проверка наличия Docker Compose (v2 может быть доступен как 'docker compose')
$dockerComposeCmd = if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    "docker-compose"
} elseif ((docker compose version) -ne $null) {
    "docker compose"
} else {
    Write-Host "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose." -ForegroundColor Red
    exit 1
}

# Остановка существующих контейнеров
Write-Host "🛑 Остановка существующих контейнеров..." -ForegroundColor Yellow
& $dockerComposeCmd -f $ComposeFile down

# Очистка старых образов (если передан параметр --clean)
if ($args[0] -eq "--clean") {
    Write-Host "🧹 Очистка старых образов..." -ForegroundColor Yellow
    & $dockerComposeCmd -f $ComposeFile down --rmi all --volumes --remove-orphans
}

# Сборка и запуск
Write-Host "🔨 Сборка и запуск контейнеров..." -ForegroundColor Yellow
& $dockerComposeCmd -f $ComposeFile up --build -d

# Ожидание готовности сервисов
Write-Host "⏳ Ожидание готовности сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Проверка статуса контейнеров
Write-Host "📊 Статус контейнеров:" -ForegroundColor Green
& $dockerComposeCmd -f $ComposeFile ps

Write-Host "✅ Проект запущен!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "🔧 Backend API: http://localhost:3000/v1" -ForegroundColor Green
Write-Host "🗄️ Adminer: http://localhost:8080" -ForegroundColor Green
Write-Host "📊 Логи: $dockerComposeCmd -f $ComposeFile logs -f" -ForegroundColor Green
Write-Host "🛑 Остановка: $dockerComposeCmd -f $ComposeFile down" -ForegroundColor Green 