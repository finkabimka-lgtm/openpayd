<?php

declare(strict_types=1);

require_once __DIR__ . '/config/db.php';

if (!empty($_SESSION['user_id'])) {
    if (($_SESSION['role'] ?? '') === 'admin') {
        redirect('admin/admin.php');
    }

    if (($_SESSION['role'] ?? '') === 'client') {
        redirect('client/home.php');
    }
}

$error = $_SESSION['login_error'] ?? '';
unset($_SESSION['login_error']);
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenPayd - Sign in</title>
    <link rel="icon" type="image/png" href="openpayd-icon.png">
    <link rel="apple-touch-icon" href="openpayd-icon.png">
    <link rel="stylesheet" href="assets/style.css">
</head>
<body class="auth-page">
    <main class="auth-shell">
        <section class="brand-block" aria-label="OpenPayd">
            <img class="brand-logo brand-logo-large" src="openpaydlogo.png" alt="OpenPayd">
        </section>

        <section class="login-card">
            <h1>Sign in</h1>

            <?php if ($error): ?>
                <div class="alert error"><?= e($error); ?></div>
            <?php endif; ?>

            <form action="auth/login.php" method="POST" class="form-stack">
                <label for="email">E-mail address *</label>
                <input type="email" id="email" name="email" autocomplete="email" required>

                <label for="password">Password *</label>
                <input type="password" id="password" name="password" autocomplete="current-password" required>

                <button type="submit" class="primary-button">Continue</button>
            </form>
        </section>

        <footer class="auth-footer">
            <div>
                <a href="#">Terms of Use</a>
                <span>|</span>
                <a href="#">Privacy Notice</a>
            </div>
            <p>© 2026 OpenPayd Holdings Limited. All rights reserved.</p>
        </footer>
    </main>
</body>
</html>
