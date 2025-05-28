# PowerShell script для запуска TimeTracker локально

Write-Host "🚀 Запуск TimeTracker локально..." -ForegroundColor Green

# Проверка наличия Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker не установлен. Пожалуйста, установите Docker Desktop." -ForegroundColor Red
    exit 1
}

# Проверка наличия Docker Compose
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose." -ForegroundColor Red
    exit 1
}

# Остановка существующих контейнеров
Write-Host "🛑 Остановка существующих контейнеров..." -ForegroundColor Yellow
docker-compose down

# Очистка старых образов (если передан параметр --clean)
if ($args[0] -eq "--clean") {
    Write-Host "🧹 Очистка старых образов..." -ForegroundColor Yellow
    docker-compose down --rmi all --volumes --remove-orphans
}

# Сборка и запуск
Write-Host "🔨 Сборка и запуск контейнеров..." -ForegroundColor Yellow
docker-compose up --build -d

# Ожидание готовности сервисов
Write-Host "⏳ Ожидание готовности сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Проверка статуса контейнеров
Write-Host "📊 Статус контейнеров:" -ForegroundColor Green
docker-compose ps

Write-Host "✅ Проект запущен!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost" -ForegroundColor Green
Write-Host "🔧 Backend API: http://localhost:3000/api" -ForegroundColor Green
Write-Host "🗄️ Adminer: http://localhost:8080" -ForegroundColor Green
Write-Host "📊 Логи: docker-compose logs -f" -ForegroundColor Green
Write-Host "🛑 Остановка: docker-compose down" -ForegroundColor Green 