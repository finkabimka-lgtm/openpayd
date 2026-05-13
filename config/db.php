<?php
/**
 * Connessione database e funzioni comuni dell'app OpenPayd.
 *
 * Configurazione pensata per XAMPP/Laragon/MAMP:
 * - Host: localhost
 * - Database: ikqftkmf_wp333
 * - Utente: ikqftkmf_wp333
 * - Password: b<W$Tp{CMq
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = 'localhost';
$dbname = 'ikqftkmf_wp333';
$username = 'ikqftkmf_wp333';
$password = 'b<W$Tp{CMq';

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $exception) {
    die('Database connection failed. Check config/db.php and import database.sql.');
}

/**
 * Protegge una pagina: se l'utente non è loggato, torna al login.
 */
function requireLogin(): void
{
    if (empty($_SESSION['user_id'])) {
        header('Location: ../index.php');
        exit;
    }
}

/**
 * Protegge una pagina per ruolo specifico (admin oppure client).
 */
function requireRole(string $role): void
{
    requireLogin();

    if (($_SESSION['role'] ?? '') !== $role) {
        header('Location: ../index.php');
        exit;
    }
}

/**
 * Evita XSS quando si stampano dati provenienti dal database o dall'utente.
 */
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
