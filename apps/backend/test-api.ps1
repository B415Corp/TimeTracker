Write-Host "🚀 Тестирование API маршрутов TimeTracker Backend" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

$BASE_URL = "http://localhost:3000"

Write-Host ""
Write-Host "1. Проверка health check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Проверка тестового эндпоинта..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/v1/testGet" -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Проверка Swagger JSON..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/docs-json" -Method Get
    Write-Host "Title: $($response.info.title)" -ForegroundColor Green
} catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📖 Документация доступна по адресу: $BASE_URL/docs" -ForegroundColor Cyan
Write-Host "" 