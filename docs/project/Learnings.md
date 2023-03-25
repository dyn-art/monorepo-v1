👨‍🏫 Learnings

## [Prisma](https://www.prisma.io/)
- [How to Build a REST API with Prisma and PostgreSQL](https://www.digitalocean.com/community/tutorials/how-to-build-a-rest-api-with-prisma-and-postgresql)
- [Preview Database with PrismaStudio](https://www.prisma.io/studio)
- [Connect PostgreSQL Database](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

### Important Commands
- `npx prisma migrate reset` - Drops the old database + schema and creates a new
  database with the updated schema
- `prisma migrate dev --name init` - Create first migration

## [Docker](https://www.docker.com/)

### Connect to PSQL Database
Find the name or ID of the container running the PostgreSQL database. You can use the docker ps command to list all running containers and their IDs and names.
```bash
$ docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS          PORTS                    NAMES
e4972eb9d0e9   postgres:12-alpine   "docker-entrypoint.s…"   26 minutes ago   Up 26 minutes   0.0.0.0:5432->5432/tcp   my-postgres-db
```
Use the docker exec command to start a shell inside the container. Replace container_name_or_id with the name or ID of the container.

```bash
$ docker exec -it container_name_or_id bash
```
Once you are inside the container's shell, run the psql command to connect to the PostgreSQL database. Replace username and database_name with your database credentials.
```bash
$ psql -U username -d database_name
```