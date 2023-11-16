DROP 
  TABLE IF EXISTS field_info CASCADE;
DROP 
  TABLE IF EXISTS ownership_details CASCADE;
DROP 
  TABLE IF EXISTS user_info CASCADE;
DROP 
  TABLE IF EXISTS table_info CASCADE;
DROP 
  TABLE IF EXISTS database_info CASCADE;

DELETE FROM field_info;
DELETE FROM ownership_details;
DELETE FROM user_info;
DELETE FROM table_info;
DELETE FROM database_info;

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
  database_id BIGINT REFERENCES database_info (id), 
  table_name VARCHAR(255), 
  created_at TIMESTAMP
);

CREATE TABLE field_info (
  id SERIAL PRIMARY KEY, 
  table_id INTEGER REFERENCES table_info(id), 
  column_name TEXT,
  data_value JSONB,
  data_type TEXT,
  column_id INTEGER
);

CREATE TABLE ownership_details (
  id SERIAL PRIMARY KEY, 
  level INTEGER, 
  user_id INTEGER REFERENCES user_info(id), 
  database_id INTEGER REFERENCES table_info(id)
);

INSERT INTO user_info (
  masterID, username, password_hash
) 
VALUES 
  (0, 'user1', 'hash1'), 
  (1, 'user2', 'hash2'), 
  (1, 'user3', 'hash3');
