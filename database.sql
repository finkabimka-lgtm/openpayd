-- Tabelle OpenPayd Bank per database esistente ikqftkmf_wp333
-- Importare questo file nel database MySQL ikqftkmf_wp333.
-- Nota: questo script NON crea un nuovo database, usa quello già disponibile.

USE ikqftkmf_wp333;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (first_name, last_name, email, password, balance, role) VALUES
('Mario', 'Admin', 'admin@openpayd.com', '$2y$12$zDI5gZ8qL.QrpcTpYj4ZG.fbBLxJv8USoKph4o8sYK5iWMrn6bSAS', 0.00, 'admin'),
('Luca', 'Rossi', 'luca@test.com', '$2y$12$AE2iR.0OdjP9i.QINeWYKOhdJOMjVqZQpyRDbPIvUJ7yYCBcYDtkK', 15230.50, 'client');
