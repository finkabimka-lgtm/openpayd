-- Tabelle OpenPayd Bank per database esistente ikqftkmf_wp333
-- Importare questo file nel database MySQL ikqftkmf_wp333.
-- Nota: questo script NON crea un nuovo database, usa quello già disponibile.

USE ikqftkmf_wp333;

DROP TABLE IF EXISTS transactions;
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

CREATE TABLE transactions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    type ENUM('IN', 'OUT') NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_transactions_user_created (user_id, created_at),
    CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (first_name, last_name, email, password, balance, role) VALUES
('Mario', 'Admin', 'admin@openpayd.com', '$2y$12$zDI5gZ8qL.QrpcTpYj4ZG.fbBLxJv8USoKph4o8sYK5iWMrn6bSAS', 0.00, 'admin'),
('Mario', 'Rossi', 'mario.rossi@test.com', '$2y$12$AE2iR.0OdjP9i.QINeWYKOhdJOMjVqZQpyRDbPIvUJ7yYCBcYDtkK', 950.00, 'client');

INSERT INTO transactions (user_id, type, description, amount, created_at) VALUES
(2, 'IN', 'Initial deposit', 1000.00, '2026-02-11 14:35:00'),
(2, 'OUT', 'Card payment', 50.00, '2026-02-12 09:20:00');
