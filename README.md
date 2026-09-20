# SENA SpaceHub — Sistema de Inventarios

Proyecto integrador (ADSO) de gestión de inventarios de equipos de cómputo, con
autenticación JWT, control de rutas por rol (RBAC), módulo de equipos, módulo
de préstamos y dashboard con estadísticas en tiempo real.

## Stack

- **Backend:** Node.js + Express, JWT (`jsonwebtoken`), `bcryptjs`, persistencia
  en memoria (arrays), estructurado en `routes/controllers/middlewares/data`.
- **Frontend:** React 18 + TypeScript (Vite), React Router DOM v6, Context API
  (`AuthContext`), Tailwind CSS, SweetAlert2.

## Estructura del proyecto

```
sena-spacehub/
  server/       # Backend Express
  frontend/     # Frontend React + Vite
```

## 1. Backend — instalación y arranque

```bash
cd server
npm install
npm run dev      # con nodemon (recarga automática)


La API queda disponible en `http://localhost:4000/api/v1`.
Puedes verificar que está viva en `GET http://localhost:4000/api/v1/health`.

## 2. Frontend — instalación y arranque

```bash
cd frontend
npm install
cp .env.example .env   
npm run dev
```

La app queda disponible en `http://localhost:5173`.

> Si el backend corre en un puerto distinto a 4000, edita `VITE_API_BASE_URL`
> en `frontend/.env`.

## 3. Usuarios semilla (contraseña para los 3: `123456`)

| Rol            | Email                     |
|----------------|---------------------------|
| Administrador  | admin@sena.edu.co         |
| Instructor     | instructor@sena.edu.co    |
| Aprendiz       | aprendiz@sena.edu.co      |
| Aprendiz (2)   | aprendiz2@sena.edu.co     |



## 4. Reglas de negocio por rol (RBAC)

| Acción                                   | Aprendiz | Instructor | Administrador |
|-------------------------------------------|:--------:|:----------:|:--------------:|
| Ver dashboard                             | ✅        | ✅          | ✅              |
| Ver inventario de equipos (solo lectura)  | ✅        | ✅          | ✅              |
| Crear / editar / eliminar equipos         | ❌        | ❌          | ✅              |
| Solicitar préstamo para sí mismo          | ✅        | ❌          | —              |
| Registrar préstamo a nombre de un aprendiz| ❌        | ❌          | ✅              |
| Ver solo sus propios préstamos            | ✅        | —          | —              |
| Ver el listado completo de préstamos      | ❌        | ✅          | ✅              |
| Registrar devolución                      | ❌        | ❌          | ✅              |

Todas estas reglas están validadas **en el backend** (`middlewares/requireRole.js`
y lógica dentro de `controllers/prestamos.controller.js`), no solo en el frontend.
El frontend únicamente oculta botones/rutas por comodidad de uso (`ProtectedRoute`,
`isAdmin` en cada página).

## 5. Módulos implementados

1. **Autenticación con control de rutas**: `LoginPage`, `AuthContext`
   (sesión en `sessionStorage`), `ProtectedRoute` (guard de sesión + guard de
   rol vía `requiredRole`), `NavBar` con nombre/rol del usuario y botón de
   cierre de sesión. Cualquier ruta protegida sin sesión redirige a `/login`;
   una ruta con rol incorrecto redirige a `/403` (pantalla clara, no un crash).
2. **Equipos (inventario)**: listar (cualquier autenticado), crear/editar/
   eliminar (solo Administrador, oculto en UI y bloqueado en API para los
   demás roles).
3. **Préstamos**: listar (filtrado por usuario si es Aprendiz), solicitar
   (autoservicio para Aprendiz con datos tomados del token; a nombre de un
   aprendiz elegido si es Administrador; bloqueado para Instructor),
   devolver (solo Administrador, con confirmación y alertas de SweetAlert2).
4. **Dashboard**: `GET /api/v1/dashboard/stats` calcula en tiempo real el
   total de equipos, operativos/mantenimiento, préstamos activos, % de
   ocupación global y por ambiente, e incidencias (derivadas de equipos en
   mantenimiento).

## 6. Decisiones de diseño visual

Se propuso una identidad propia en lugar de replicar 1:1 las guías de clase,
conservando el 100% de la funcionalidad pedida:

- **Paleta:** fondo `#F4F6F3` (cálido, no genérico), superficie blanca,
  texto `#16231D`, verde institucional (`#2F8F3B`) como acento principal, y
  naranja/ámbar/rojo (`#E5762A`/`#C98A1E`/`#C4462B`) como colores de señal
  para estados y alertas — referencian el naranja/verde del SENA sin copiar
  un verde saturado de marca.
- **Tipografía:** `Space Grotesk` para títulos (carácter técnico, apropiado
  para un sistema de inventario de hardware) e `Inter` para texto y datos.
- **Layout:** sidebar fija con navegación + identidad de usuario, en vez de
  un navbar superior — deja más espacio horizontal para las tablas de
  equipos y préstamos, que son el contenido principal del sistema.
- Las tarjetas del dashboard usan un borde de color a la izquierda en vez
  del típico "card con sombra gris genérica", para diferenciar visualmente
  cada métrica sin recurrir al kit de tarjetas por defecto.

## 7. Notas técnicas

- La persistencia es en memoria (arrays en `server/data/*.js`), por lo que
  los datos se reinician cada vez que reinicias el servidor. El código ya
  está separado en `routes/controllers/data` para facilitar una futura
  migración a una base de datos real sin tocar la lógica de negocio.
- El endpoint `GET /api/v1/usuarios/aprendices` (solo Administrador) no
  estaba en el enunciado original, pero es necesario para que el modal de
  "Nuevo préstamo" permita al Administrador elegir a qué aprendiz asigna
  el equipo.
