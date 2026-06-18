# Registro Autos

Aplicación full-stack para registro y gestión de autos por usuario autenticado.
El sistema permite registrar usuarios, iniciar sesión mediante JWT y administrar autos propios mediante operaciones de consulta, creación, edición y eliminación.

---

## Tecnologías utilizadas

### Backend

- Java 17
- Spring Boot 3.5.14
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- SQL Server
- JWT
- Bean Validation
- Lombok

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router DOM
- React Hook Form
- Zod
- Lucide React

### Base de datos e infraestructura

- SQL Server 2022
- Docker Compose
- Scripts SQL manuales

---

## Requisitos previos

Antes de ejecutar el proyecto localmente, tener instalado:

- Java 17 o superior
- Maven 3.9 o similar, o usar Maven Wrapper incluido en el backend
- Node.js 20 o superior
- npm
- Docker Desktop o una instancia de bd correspondiente lista para conexion.
- SQL Server Management Studio.
- Postman, para pruebas de API

---

## Estructura del proyecto

```text
registro-autos
├── backend             # API REST Spring Boot
├── frontend            # Aplicación React + TypeScript
├── database            # Scripts SQL
├── postman             # Colección Postman
├── docker-compose.yml  # Para la gestion de una instancia de BD
├── .env.example           
├── .gitignore
└── README.md
```

---

## Variables de entorno

Los archivos `.env` reales no se incluyen por seguridad.

Se entregan archivos `.env.example` como base de ejemplo. Para ejecutar el proyecto localmente, cada persona debe crear sus propios archivos `.env`.

### Archivo `.env` raíz

Este archivo se usa para configurar la instancia de base de datos o puntualmente una imagen en Docker para base de datos y backend.

Desde la raíz del proyecto:

```powershell
Copy-Item .env.example .env
```

Contenido esperado:

```env
# DATABASE / DOCKER / BACKEND
DB_HOST=localhost
DB_PORT=1433
DB_NAME=car_registry_db
DB_USERNAME=sa
DB_PASSWORD=Astr0ngPassword123!

# JWT
JWT_SECRET=ajustar-a-minimo-32-caracteres-secretos
JWT_EXPIRATION_MS=86400000

# BACKEND
SERVER_PORT=8081
```

La variable `JWT_SECRET` debe tener mínimo 32 caracteres.

Para generar una clave local en PowerShell se puede usar:

```powershell
$bytes = New-Object byte[] 48
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
[Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+','-').Replace('/','_')
$rng.Dispose()
```

Copiar el resultado en:

```env
JWT_SECRET=clave_generada
```

### Archivo `.env` del frontend

Este archivo se usa únicamente por Vite/React.

Desde la carpeta `frontend`:

```powershell
Copy-Item .env.example .env
```

Contenido esperado:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```
---

## Ejecución local del proyecto

El orden recomendado para ejecutar el proyecto es:

1. Crear los archivos `.env`.
2. Levantar SQL Server o utilizar una imagen correspondiente con Docker.
3. Ejecutar los scripts SQL.
4. Levantar el backend.
5. Levantar el frontend.
6. Probar la aplicación desde el navegador o Postman.

---

## 1. Levantar SQL Server con Docker

Desde la raíz del proyecto:

```powershell
docker compose up -d
```

Validar que el contenedor esté corriendo:

```powershell
docker ps
```

Debe aparecer un contenedor similar a:

```text
registro-autos-sqlserver
```

Para revisar los logs del contenedor:

```powershell
docker logs registro-autos-sqlserver
```

Esperar hasta que SQL Server esté listo para recibir conexiones.

## 1.1 En caso de tener una instancia SQL Server sin Docker

Si se cuenta con una instancia SQL Server local o remota, no es obligatorio usar Docker.
En ese caso, la instancia debe estar previamente creada y disponible para conexión. Luego se deben ajustar los valores del archivo `.env` raíz con los datos reales de conexión:

```env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=car_registry_db
DB_USERNAME=sa
DB_PASSWORD=Astr0ngPassword123!
```

## 2. Ejecutar scripts SQL

Los scripts se encuentran en la carpeta `database`.

Ejecutarlos en este orden desde SQL Server Management Studio o un cliente SQL equivalente:

```text
database/00_create_database.sql
database/01_create_tables.sql
database/02_insert_demo_data.sql
```

El script `00_create_database.sql` crea la base de datos.

El script `01_create_tables.sql` crea las tablas principales:

- `users`
- `cars`

La tabla `cars` tiene relación con `users` mediante `user_id`.

El script `02_insert_demo_data.sql` inserta datos iniciales de prueba.

---

## 3. Ejecutar backend

Estos comandos pueden ejecutarse desde PowerShell o desde la terminal integrada del IDE, IntelliJ IDEA u otro editor compatible.

Desde la carpeta `backend`:

```powershell
cd backend
mvn clean compile
mvn spring-boot:run
```

También se puede ejecutar usando Maven Wrapper desde un IDE

```powershell
cd backend
.\mvnw clean compile
.\mvnw spring-boot:run
```

El backend queda disponible en:

```text
http://localhost:8081
```

La API base queda disponible en:

```text
http://localhost:8081/api
```

Si el backend no inicia y aparece un error de conexión a SQL Server, validar que Docker esté corriendo y que el contenedor de SQL Server esté activo,
o que la instancia de BD local este disponible y las credenciales de conexion sean las adecuadas.

---

## 4. Ejecutar frontend

Estos comandos pueden ejecutarse desde PowerShell o desde la terminal integrada del IDE.

Desde la carpeta `frontend`:

```powershell
cd frontend
npm install
npm run dev
```

El frontend normalmente estara disponible en:

```text
http://localhost:5173
```

Si el puerto está ocupado, Vite puede levantar la aplicación en otro puerto, por ejemplo:

```text
http://localhost:5174
```

## Endpoints principales

### Autenticación

Método + Endpoint + Descripción 

POST - `/api/auth/register` - Registra un usuario 
POST - `/api/auth/login`    - Autentica un usuario y devuelve JWT 

### Autos

Los endpoints de autos requieren token JWT.

Header requerido:

```http
Authorization: Bearer <token>
```

Método + Endpoint + Descripción 

GET    - `/api/cars`       - Lista los autos del usuario autenticado 
GET    - `/api/cars/{id}`  - Consulta un auto del usuario autenticado 
POST   - `/api/cars`       - Crea un auto 
PUT    -  `/api/cars/{id}` - Actualiza un auto 
DELETE - `/api/cars/{id}`  - Elimina un auto 

---

## Pruebas con Postman

La colección Postman se encuentra en la carpeta:

```text
postman
```

frente a la gestion del token para pruebas, el proyecto se encuentra configurado para que una vez ejecutada la autenticacion
se alimente la variable Token parametrizada para ejecutar posteriormente los endpoints correpsondientes a CREACION, CONSULTA, EDICION, ELIMINACION

Variable recomendada para la colección:

```text
baseUrl = http://localhost:8081
```