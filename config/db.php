<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = 'localhost';
$dbname = 'ikqftkmf_wp333';
$username = 'ikqftkmf_wp333';
$password = '&M=0Nv;QG;?I0z&T';

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

} catch (PDOException $e) {

    die("DB CONNECTION FAILED: " . $e->getMessage());
}
