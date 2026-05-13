<?php

declare(strict_types=1);

/** @var ?PDO $pdo */
$pdo = require __DIR__ . '/../config/db.php';
requireRole('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('admin.php');
}

$firstName = trim($_POST['first_name'] ?? '');
$lastName = trim($_POST['last_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$balance = $_POST['balance'] ?? '';

if ($firstName === '' || $lastName === '' || $email === '' || $password === '' || $balance === '') {
    $_SESSION['admin_error'] = 'Compila tutti i campi del form.';
    redirect('admin.php');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['admin_error'] = 'Inserisci un indirizzo email valido.';
    redirect('admin.php');
}

if (!is_numeric($balance) || (float) $balance < 0) {
    $_SESSION['admin_error'] = 'Il saldo iniziale deve essere un numero positivo.';
    redirect('admin.php');
}

if (!$pdo instanceof PDO) {
    $_SESSION['admin_error'] = 'Database temporaneamente non disponibile. Riprova più tardi.';
    redirect('admin.php');
}

try {
    $stmt = $pdo->prepare(
        'INSERT INTO users (first_name, last_name, email, password, balance, role)
         VALUES (:first_name, :last_name, :email, :password, :balance, :role)'
    );

    $stmt->execute([
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'balance' => (float) $balance,
        'role' => 'client',
    ]);

    $_SESSION['admin_success'] = 'Cliente creato con successo.';
} catch (Throwable $exception) {
    if ($exception->getCode() === '23000') {
        $_SESSION['admin_error'] = 'Esiste già un utente con questa email.';
    } else {
        $_SESSION['admin_error'] = 'Errore durante la creazione del cliente.';
    }
}

redirect('admin.php');
