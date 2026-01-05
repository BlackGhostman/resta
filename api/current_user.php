<?php
error_reporting(0); // Suppress errors for API response
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json');

ob_start(); // Start buffer to catch potential unwanted output

if (isset($_SESSION['user_name'])) {
    $response = [
        'success' => true, 
        'user_name' => $_SESSION['user_name'],
        'user_profile' => isset($_SESSION['user_profile']) ? $_SESSION['user_profile'] : ''
    ];
} else {
    $response = ['success' => false, 'message' => 'No session'];
}

ob_end_clean(); // Clean buffer
echo json_encode($response);
?>
