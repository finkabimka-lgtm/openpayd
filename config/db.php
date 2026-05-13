<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/*
|--------------------------------------------------------------------------
| DATABASE CONFIG
|--------------------------------------------------------------------------
| ⚠️ IMPORTANTE:
| 192.142.10.5 probabilmente NON è il DB host corretto.
| In 90% dei hosting è "localhost".
|--------------------------------------------------------------------------
*/

$host = 'localhost'; // 🔥 FIX PRINCIPALE
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
            PDO::ATTR_TIMEOUT => 5,
        ]
    );

} catch (PDOException $exception) {

    // 🔥 NON bloccare il sito senza debug
    error_log("DB ERROR: " . $exception->getMessage());

    http_response_code(500);

    die("Database connection failed. Check DB credentials or hosting configuration.");
}

/*
|--------------------------------------------------------------------------
| AUTH HELPERS
|--------------------------------------------------------------------------
*/

function requireLogin(): void
{
    if (empty($_SESSION['user_id'])) {
        header('Location: ../index.php');
        exit;
    }
}

function requireRole(string $role): void
{
    requireLogin();

    if (($_SESSION['role'] ?? '') !== $role) {
        header('Location: ../index.php');
        exit;
    }
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
