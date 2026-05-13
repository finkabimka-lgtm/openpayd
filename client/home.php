<?php

declare(strict_types=1);

/** @var ?PDO $pdo */
$pdo = require __DIR__ . '/../config/db.php';
requireRole('client');

$user = null;
$transactions = [];
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

        if ($user) {
            $transactionStmt = $pdo->prepare(
                'SELECT type, description, amount, created_at
                 FROM transactions
                 WHERE user_id = :user_id
                 ORDER BY created_at DESC, id DESC'
            );
            $transactionStmt->execute(['user_id' => $_SESSION['user_id']]);
            $transactions = $transactionStmt->fetchAll();
        }
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

        <?php if (!$pageError): ?>
            <section class="hero-card transactions-card">
                <div class="section-heading">
                    <p class="eyebrow">Movimenti conto</p>
                    <h2>Transaction History</h2>
                </div>

                <div class="table-wrap transaction-table-wrap">
                    <table class="transaction-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Descrizione</th>
                                <th>Tipo</th>
                                <th>Importo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($transactions) === 0): ?>
                                <tr>
                                    <td colspan="4" class="empty-state">No transactions yet</td>
                                </tr>
                            <?php endif; ?>

                            <?php foreach ($transactions as $transaction): ?>
                                <?php
                                $transactionType = $transaction['type'] === 'OUT' ? 'OUT' : 'IN';
                                $isIncoming = $transactionType === 'IN';
                                $amountPrefix = $isIncoming ? '+' : '-';
                                $createdAt = strtotime((string) $transaction['created_at']);
                                $formattedDate = $createdAt ? date('d.m.Y H:i', $createdAt) : '';
                                ?>
                                <tr>
                                    <td><?= e($formattedDate); ?></td>
                                    <td><?= e($transaction['description']); ?></td>
                                    <td>
                                        <span class="transaction-badge <?= $isIncoming ? 'in' : 'out'; ?>">
                                            <?= e($transactionType); ?>
                                        </span>
                                    </td>
                                    <td class="amount <?= $isIncoming ? 'in' : 'out'; ?>">
                                        <?= e($amountPrefix . '€ ' . number_format((float) $transaction['amount'], 2, ',', '.')); ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </section>
        <?php endif; ?>
    </main>
</body>
</html>
