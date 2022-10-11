-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS adv_users CASCADE;
DROP TABLE IF EXISTS adv_todos;



CREATE TABLE adv_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE adv_todos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT,
  completed BOOLEAN NOT NULL DEFAULT(FALSE),
  description VARCHAR,
  FOREIGN KEY (user_id) REFERENCES adv_users(id)
);