CREATE DATABASE restaurant;

CREATE TABLE employee
(
    ID SERIAL NOT NULL PRIMARY KEY,
    user_num VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE reservation
(
    ID SERIAL NOT NULL PRIMARY KEY,
    table_num INTEGER NOT NULL,
    date DATE NOT NULL,
    start_at TIME NOT NULL,
    end_at TIME NOT NULL, 
    seats INTEGER NOT NULL
);

CREATE TABLE tables
(
    ID SERIAL NOT NULL PRIMARY KEY,
    seats INTEGER NOT NULL
);

INSERT INTO tables (seats) VALUES (2), (2), (4), (6);