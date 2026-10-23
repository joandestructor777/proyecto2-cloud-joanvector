# Guía de Despliegue en Microsoft Azure - Juan (HU-12)

Esta guía explica cómo desplegar la plataforma **JoanVector** en la nube pública de Microsoft Azure en solo 15 a 20 minutos.

---

## 1. Arquitectura de Despliegue en Azure:
- **Backend API:** Azure App Service (Linux, Python 3.11, FastAPI + Uvicorn).
- **Frontend SPA:** Azure Static Web Apps (Vite + React 19 empaquetado).
- **Base de Datos:** SQLite local en disco persistente o Azure Database for PostgreSQL.
- **Monitoreo perimetral:** Endpoint `/health` con SSL/HTTPS automático.

---

## 2. Despliegue del Backend en Azure App Service:

1. **Inicia sesión en Azure CLI:**
   ```bash
   az login
   ```

2. **Crea el grupo de recursos:**
   ```bash
   az group create --name rg-joanvector --location eastus
   ```

3. **Despliega el Backend desde la carpeta `backend`:**
   ```bash
   cd backend
   az webapp up --name joanvector-api --resource-group rg-joanvector --runtime "PYTHON:3.11" --sku F1
   ```

4. **Configura el comando de arranque:**
   ```bash
   az webapp config set --resource-group rg-joanvector --name joanvector-api --startup-file "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
   ```

5. **Verifica la salud del servicio:**
   Abre en el navegador:
   `https://joanvector-api.azurewebsites.net/health`
   Debe responder:
   ```json
   {
     "status": "healthy",
     "service": "JoanVector - AI Security Guardrail",
     "version": "1.0.0",
     "security_engine": "ACTIVE"
   }
   ```

---

## 3. Despliegue del Frontend en Azure Static Web Apps:

1. **Actualiza la variable de entorno en `frontend/.env`:**
   ```env
   VITE_API_URL=https://joanvector-api.azurewebsites.net/api/v1
   ```

2. **Desde el portal de Azure o mediante Azure CLI:**
   - Crea un recurso **Static Web Apps**.
   - Conéctalo con tu repositorio en GitHub.
   - Ruta de aplicación: `/frontend`
   - Ruta de salida: `dist`
   - Comando de compilación: `npm run build`

3. **Verificación de CORS:**
   El backend ya incluye `allow_origins=["*"]`, permitiendo tráfico seguro sin bloqueos en el navegador.

---

## 4. Sustentación de la HU-12:
- Muestra el endpoint `/health` respondiendo HTTP 200 en Azure.
- Muestra la consola SOC y el portal CompenHack operando bajo HTTPS.
- Dispara un prompt malicioso desde el portal público de Azure y muestra la mitigación HTTP 403 inmediata (<200 ms).
