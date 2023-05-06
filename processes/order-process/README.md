# `order-process`

### Create PSQL Schema and use it with Camunda

> https://stackoverflow.com/questions/40989183/camunda-spring-boot-starter-create-database-in-schema-not-working/75846724#75846724

 1. Create a new schema in your PostgreSQL database using the `CREATE SCHEMA` command:
    ```
    CREATE SCHEMA my_schema;
    ```
 2. Grant all permissions on the new schema to the `postgres` user using the `GRANT` command:
    ```
    GRANT ALL ON SCHEMA my_schema TO postgres;
    ```
 3. Set the search path to the new schema using the `SET search_path` command:
    ```
    SET search_path = my_schema;
    ```
    So that you can later check whether the tables were created successfully in the 
    correct schema using the `\dt` command.
 4. Update your application.yml file to specify the new schema in the JDBC URL and in the Camunda BPM configuration:
```
spring.datasource:
  url: jdbc:postgresql://localhost:5001/my_database?autoReconnect=true&currentSchema=my_schema # <-
  username: postgres
  password: postgres
  driver-class-name: org.postgresql.Driver

camunda.bpm:
  admin-user:
    id: demo
    password: demo
  database:

    type: postgres
    schema-name: my_schema # <-
    table-prefix: my_schema. # <-
```

**Just a reminder:**
In PostgreSQL, a schema is a named collection of database objects, including tables, indexes, views, and sequences. Schemas are useful for organizing objects into logical groups, providing better security and access control, and avoiding naming conflicts.
