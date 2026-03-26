# SpeedType - Competencia de Escritura Rapida

Una aplicacion de competencia de escritura rapida desarrollada por AndesTech.

## Caracteristicas

- Competencia de escritura con textos largos
- Cronometro de precision
- Tabla de clasificacion en tiempo real
- Soporte para multiples participantes

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Docker

La app puede levantarse con PostgreSQL local usando Docker Compose.

Variables esperadas:

- DATABASE_URL
- ADMIN_USERNAME
- ADMIN_PASSWORD
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD

Comandos:

```bash
docker compose up --build
```

La aplicacion queda disponible en http://localhost:3000 y PostgreSQL en localhost:5432.

El servicio `migrate` ejecuta `npm run db:migrate` antes de iniciar la app.
