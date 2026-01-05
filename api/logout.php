<?php
error_reporting(0);
ini_set('display_errors', 0);
session_start();

// 1. Clear session data in memory
$_SESSION = array();

// 2. Kill the cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
    // Force root path deletion just in case
    setcookie(session_name(), '', time() - 42000, '/');
}

// 3. Destroy session storage on server
session_destroy();

// 4. Send headers
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

echo json_encode(['success' => true, 'redirect' => 'login.html']);
?>
