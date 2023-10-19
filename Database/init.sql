DROP TABLE IF EXISTS field_info;
DROP TABLE IF EXISTS ownership_details;
DROP TABLE IF EXISTS user_info;
DROP TABLE IF EXISTS table_info;
DROP TABLE IF EXISTS database_info;

CREATE TABLE user_info (
                           id SERIAL PRIMARY KEY,
                           masterID INTEGER NOT NULL,
                           username VARCHAR(255),
                           email VARCHAR(255),
                           password_hash VARCHAR(255),
                           created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE database_info (
                               id SERIAL PRIMARY KEY,
                               database_name TEXT,
                               created_at TIMESTAMP
);


CREATE TABLE table_info (
                                id SERIAL PRIMARY KEY,
                                database_id INTEGER REFERENCES database_info (id),
                                table_name VARCHAR(255),
                                created_at TIMESTAMP
);

CREATE TABLE field_info (
                            id SERIAL PRIMARY KEY,
                            table_id INTEGER REFERENCES table_info(id),
                            column_name TEXT,
                            column_id INTEGER,
                            value JSONB
);

CREATE TABLE ownership_details (
                                   id SERIAL PRIMARY KEY,
                                   level INTEGER,
                                   user_id INTEGER REFERENCES user_info(id),
                                   database_id INTEGER REFERENCES table_info(id)
);

INSERT INTO user_info (masterID, username, password_hash)
VALUES
    (0, 'user1', 'hash1'),
    (1, 'user2', 'hash2'),
    (1, 'user3', 'hash3');

