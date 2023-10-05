DROP TABLE IF EXISTS ownership_details;
DROP TABLE IF EXISTS database_table;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    masterID INTEGER,
    name VARCHAR(255),
    lastname VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE database_table (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE ownership_details (
    id SERIAL PRIMARY KEY,
    level INTEGER,
    user_id INTEGER REFERENCES users(id),
    database_id INTEGER REFERENCES database_table(id)
);
