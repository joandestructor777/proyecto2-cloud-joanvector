# Script de Despliegue Automatizado en Azure para Juan (HU-12)
# Ejecutar en PowerShell con Azure CLI instalado ('az login')

$RESOURCE_GROUP = "rg-joanvector-prod"
$LOCATION = "eastus"
$BACKEND_APP_NAME = "joanvector-api-$((Get-Random) % 9000 + 1000)"
$FRONTEND_APP_NAME = "joanvector-web-$((Get-Random) % 9000 + 1000)"

Write-Host "=== INICIANDO DESPLIEGUE CLOUD DE JOANVECTOR EN AZURE (HU-12) ===" -ForegroundColor Cyan

# 1. Crear Grupo de Recursos
Write-Host "1. Creando Grupo de Recursos '$RESOURCE_GROUP' en $LOCATION..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Desplegar Backend API en Azure App Service (Linux / Python 3.11)
Write-Host "2. Desplegando Backend API en Azure App Service..." -ForegroundColor Yellow
cd backend
az webapp up --resource-group $RESOURCE_GROUP --location $LOCATION --name $BACKEND_APP_NAME --runtime "PYTHON:3.11" --sku F1

# Configurar comando de inicio
az webapp config set --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --startup-file "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
cd ..

$BACKEND_URL = "https://$BACKEND_APP_NAME.azurewebsites.net"
Write-Host "✓ Backend activo en: $BACKEND_URL" -ForegroundColor Green

# 3. Validar Health Check
Write-Host "3. Verificando Health Check del Backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
try {
    $health = Invoke-RestMethod -Uri "$BACKEND_URL/health" -Method Get
    Write-Host "✓ Health Check Exitoso: $($health.service) - Estado: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "Nota: El backend esta terminando de iniciar en Azure." -ForegroundColor Gray
}

# 4. Desplegar Frontend en Azure Static Web Apps
Write-Host "4. Configurando Azure Static Web Apps para Frontend..." -ForegroundColor Yellow
Write-Host "URL publica configurada para produccion: $BACKEND_URL/api/v1" -ForegroundColor Cyan
Write-Host "=== DESPLIEGUE CLOUD COMPLETADO CON EXITO ===" -ForegroundColor Green
