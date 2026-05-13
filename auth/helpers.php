<?php

declare(strict_types=1);

/**
 * Starts the application session exactly once with safer cookie defaults.
 */
function startAppSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.use_strict_mode', '1');
        ini_set('session.cookie_httponly', '1');

        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (($_SERVER['SERVER_PORT'] ?? null) === '443');

        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'domain' => '',
            'secure' => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        session_start();
    }
}

/**
 * Escape untrusted output before rendering it in HTML.
 */
function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Redirect and stop execution.
 */
function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

/**
 * Store a login/authentication error that the login page can display.
 */
function setAuthError(string $message): void
{
    $_SESSION['login_error'] = $message;
}

/**
 * Require an authenticated user session.
 */
function requireLogin(): void
{
    startAppSession();

    if (empty($_SESSION['user_id']) || empty($_SESSION['role'])) {
        setAuthError('Effettua il login per accedere a questa pagina.');
        redirect('../index.php');
    }
}

/**
 * Require the current authenticated user to have the given role.
 */
function requireRole(string $role): void
{
    requireLogin();

    if (($_SESSION['role'] ?? '') === $role) {
        return;
    }

    setAuthError('Non hai i permessi per accedere a questa pagina.');

    if (($_SESSION['role'] ?? '') === 'admin') {
        redirect('../admin/admin.php');
    }

    if (($_SESSION['role'] ?? '') === 'client') {
        redirect('../client/home.php');
    }

    redirect('../index.php');
}
