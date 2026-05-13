<?php

declare(strict_types=1);

/** @var ?PDO $pdo */
$pdo = require __DIR__ . '/../config/db.php';
requireRole('client');

$user = null;
$pageError = '';

if (!$pdo instanceof PDO) {
    $pageError = 'Database temporaneamente non disponibile. Riprova più tardi.';
} else {
    try {
        $stmt = $pdo->prepare('SELECT first_name, last_name, balance FROM users WHERE id = :id AND role = :role LIMIT 1');
        $stmt->execute([
            'id' => $_SESSION['user_id'],
            'role' => 'client',
        ]);
        $user = $stmt->fetch();
    } catch (Throwable $exception) {
        error_log('Client home query failed: ' . $exception->getMessage());
        $pageError = 'Impossibile caricare i dati del conto in questo momento.';
    }
}

if (!$pageError && !$user) {
    redirect('../auth/logout.php');
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
            <?php if ($pageError): ?>
                <div class="alert error"><?= e($pageError); ?></div>
            <?php else: ?>
                <h1>Hello <?= e($user['first_name'] . ' ' . $user['last_name']); ?></h1>
                <div class="balance-box">
                    <span>Saldo disponibile</span>
                    <strong>€ <?= number_format((float) $user['balance'], 2, ',', '.'); ?></strong>
                </div>
            <?php endif; ?>
        </section>
    </main>
</body>
</html>
