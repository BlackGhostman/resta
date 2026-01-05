<?php
error_reporting(0);
ini_set('display_errors', 0);
session_start();
session_unset();
session_destroy();
header('Content-Type: application/json');

ob_start();
echo json_encode(['success' => true, 'redirect' => 'login.html']);
ob_end_flush();
?>
