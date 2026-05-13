<?php

declare(strict_types=1);

require_once __DIR__ . '/../auth/helpers.php';

startAppSession();

/**
 * Read a database setting from the environment with a safe fallback.
 */
function dbEnv(string $key, string $default = ''): string
{
    $value = getenv($key);

    if ($value === false || $value === '') {
        return $default;
    }

    return $value;
}

/**
 * Create and reuse one PDO connection for the current request.
 *
 * Returns null when the connection cannot be established so pages can show a
 * controlled error instead of crashing with a fatal exception.
 */
function getPdo(): ?PDO
{
    static $pdo = null;
    static $connectionAttempted = false;

    if ($connectionAttempted) {
        return $pdo;
    }

    $connectionAttempted = true;

    if (!class_exists(PDO::class)) {
        error_log('Database connection failed: PDO extension is not available.');
        return null;
    }

    $host = dbEnv('DB_HOST', 'localhost');
    $port = dbEnv('DB_PORT', '3306');
    $dbname = dbEnv('DB_NAME', 'ikqftkmf_wp333');
    $username = dbEnv('DB_USER', 'ikqftkmf_wp333');
    $password = dbEnv('DB_PASS', '&M=0Nv;QG;?I0z&T');
    $charset = dbEnv('DB_CHARSET', 'utf8mb4');

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $host, $port, $dbname, $charset);

    try {
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $exception) {
        error_log('Database connection failed: ' . $exception->getMessage());
        $pdo = null;
    }

    return $pdo;
}

$pdo = getPdo();

return $pdo;
