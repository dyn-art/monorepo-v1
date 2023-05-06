# 👨‍🏫 Learnings

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
> https://medium.com/@bennokohrs/connect-to-postgresql-database-inside-docker-container-7dab32435b49

Find the name or ID of the container running the PostgreSQL database. You can use the docker ps command to list all running containers and their IDs and names.
```bash
$ docker ps

CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS          PORTS                    NAMES
e4972eb9d0e9   postgres:12-alpine   "docker-entrypoint.s…"   26 minutes ago   Up 26 minutes   0.0.0.0:5432->5432/tcp   my-postgres-db
```
Use the docker exec command to start a shell inside the container. Replace `container_name_or_id` with the name or ID of the container.
```bash
$ docker exec -it container_name_or_id bash
```
Once you are inside the container's shell, run the psql command to connect to the PostgreSQL database. Replace username and database_name with your database credentials.
```bash
$ psql -U username -d database_name
```

## [Postgres](https://www.postgresql.org/)

### Schema
> https://medium.com/@bennokohrs/postgresql-schema-17a2df780626

In PostgreSQL, a schema is a named collection of database objects, including tables, indexes, views, and sequences. Schemas are useful for organizing objects into logical groups, providing better security and access control, and avoiding naming conflicts.

When you create a new database in PostgreSQL, it automatically creates a default schema called public. You can create additional schemas to organize your objects into separate namespaces. Each schema can have its own set of objects, and you can grant or revoke permissions on schemas to control access to objects.

To create a new schema, you can use the CREATE SCHEMA command followed by the name of the schema you want to create. For example:
```sql
CREATE SCHEMA my_schema;
```
Once you create a schema, you can create tables, indexes, views, and other objects in that schema by specifying the schema name as a prefix to the object name. For example, to create a table named orders in the my_schema schema, you can use the following command:
```sql
CREATE TABLE my_schema.orders (id SERIAL PRIMARY KEY, customer_id INT, total DECIMAL(10, 2));
```
To set the search path for your PostgreSQL session to a particular schema, you can use the SET search_path command followed by a comma-separated list of schema names in the order you want PostgreSQL to search for objects. For example:
```sql
SET search_path = my_schema, public;
```
This sets the search path to first look for objects in the my_schema schema, then in the public schema (the default schema). You can use the SHOW search_path command to view the current search path.

In summary, schemas are a powerful tool for organizing your database objects in PostgreSQL, and can help you avoid naming conflicts, provide better security, and manage your database more effectively.

## [DiscordJs](https://discord.js.org/#/)

### How to use `/commands`
> https://www.youtube.com/watch?v=pXehoXnFxPM

### How to create own `Command Handler`
> https://www.youtube.com/watch?v=0NqG6tq-TLc