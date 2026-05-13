<?php

declare(strict_types=1);

/** @var ?PDO $pdo */
$pdo = require __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('../index.php');
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    setAuthError('Inserisci email e password.');
    redirect('../index.php');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    setAuthError('Inserisci un indirizzo email valido.');
    redirect('../index.php');
}

if (!$pdo instanceof PDO) {
    setAuthError('Servizio temporaneamente non disponibile. Riprova più tardi.');
    redirect('../index.php');
}

try {
    $stmt = $pdo->prepare(
        'SELECT id, first_name, last_name, email, password, role
         FROM users
         WHERE email = :email
         LIMIT 1'
    );
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
} catch (Throwable $exception) {
    error_log('Login query failed: ' . $exception->getMessage());
    setAuthError('Impossibile completare il login. Riprova più tardi.');
    redirect('../index.php');
}

if (!$user || !password_verify($password, (string) $user['password'])) {
    setAuthError('Credenziali non valide. Riprova.');
    redirect('../index.php');
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];
$_SESSION['first_name'] = (string) $user['first_name'];
$_SESSION['last_name'] = (string) $user['last_name'];
$_SESSION['email'] = (string) $user['email'];
$_SESSION['role'] = (string) $user['role'];

if ($_SESSION['role'] === 'admin') {
    redirect('../admin/admin.php');
}

redirect('../client/home.php');
