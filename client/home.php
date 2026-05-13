<?php
require_once __DIR__ . '/../config/db.php';
requireRole('client');

$stmt = $pdo->prepare('SELECT first_name, last_name, balance FROM users WHERE id = :id AND role = :role LIMIT 1');
$stmt->execute([
    'id' => $_SESSION['user_id'],
    'role' => 'client',
]);
$user = $stmt->fetch();

if (!$user) {
    header('Location: ../auth/logout.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenPayd - Home cliente</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body class="app-page">
    <main class="dashboard-shell">
        <nav class="topbar">
            <a class="brand-inline" href="home.php">
                <span class="brand-mark small">P</span>
                <span>OpenPayd</span>
            </a>
            <a href="../auth/logout.php" class="logout-link">Logout</a>
        </nav>

        <section class="hero-card balance-card">
            <p class="eyebrow">Client area</p>
            <h1>Hello <?= e($user['first_name'] . ' ' . $user['last_name']); ?></h1>
            <div class="balance-box">
                <span>Saldo disponibile</span>
                <strong>€ <?= number_format((float) $user['balance'], 2, ',', '.'); ?></strong>
            </div>
        </section>
    </main>
</body>
</html>
