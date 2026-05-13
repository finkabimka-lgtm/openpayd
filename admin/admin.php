<?php

declare(strict_types=1);

/** @var ?PDO $pdo */
$pdo = require __DIR__ . '/../config/db.php';
requireRole('admin');

$success = $_SESSION['admin_success'] ?? '';
$error = $_SESSION['admin_error'] ?? '';
unset($_SESSION['admin_success'], $_SESSION['admin_error']);

$clients = [];
$dbError = '';

if (!$pdo instanceof PDO) {
    $dbError = 'Database temporaneamente non disponibile. Riprova più tardi.';
} else {
    try {
        $stmt = $pdo->prepare('SELECT first_name, last_name, email, balance FROM users WHERE role = :role ORDER BY id DESC');
        $stmt->execute(['role' => 'client']);
        $clients = $stmt->fetchAll();
    } catch (Throwable $exception) {
        error_log('Admin client list query failed: ' . $exception->getMessage());
        $dbError = 'Impossibile caricare la lista clienti in questo momento.';
    }
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenPayd - Admin</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body class="app-page">
    <main class="dashboard-shell wide">
        <nav class="topbar">
            <a class="brand-inline" href="admin.php">
                <span class="brand-mark small">P</span>
                <span>OpenPayd</span>
            </a>
            <a href="../auth/logout.php" class="logout-link">Logout</a>
        </nav>

        <section class="admin-grid">
            <div class="hero-card">
                <p class="eyebrow">Admin panel</p>
                <h1>Welcome Admin</h1>
                <p class="muted">Registra un nuovo cliente e imposta il saldo iniziale.</p>

                <?php if ($success): ?>
                    <div class="alert success"><?= e($success); ?></div>
                <?php endif; ?>

                <?php if ($error): ?>
                    <div class="alert error"><?= e($error); ?></div>
                <?php endif; ?>

                <?php if ($dbError): ?>
                    <div class="alert error"><?= e($dbError); ?></div>
                <?php endif; ?>

                <form action="create_user.php" method="POST" class="form-stack admin-form">
                    <div class="two-columns">
                        <div>
                            <label for="first_name">Nome</label>
                            <input type="text" id="first_name" name="first_name" required>
                        </div>
                        <div>
                            <label for="last_name">Cognome</label>
                            <input type="text" id="last_name" name="last_name" required>
                        </div>
                    </div>

                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" autocomplete="email" required>

                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" autocomplete="new-password" required>

                    <label for="balance">Saldo iniziale</label>
                    <input type="number" id="balance" name="balance" min="0" step="0.01" required>

                    <button type="submit" class="primary-button">Crea cliente</button>
                </form>
            </div>

            <div class="hero-card clients-card">
                <p class="eyebrow">Clienti registrati</p>
                <h2>Lista clienti</h2>

                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($clients) === 0): ?>
                                <tr>
                                    <td colspan="3" class="empty-state">Nessun cliente registrato.</td>
                                </tr>
                            <?php endif; ?>

                            <?php foreach ($clients as $client): ?>
                                <tr>
                                    <td><?= e($client['first_name'] . ' ' . $client['last_name']); ?></td>
                                    <td><?= e($client['email']); ?></td>
                                    <td>€ <?= number_format((float) $client['balance'], 2, ',', '.'); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
