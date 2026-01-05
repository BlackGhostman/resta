<?php
// Simulate session for eaguilar
session_start();
$_SESSION['user_name'] = 'E. Aguilar';
$_SESSION['user_profile'] = 'administrador';

// Capture output of current_user.php
ob_start();
require 'current_user.php';
$output = ob_get_clean();

echo "Raw Output: " . $output . "\n";
$json = json_decode($output, true);

if ($json && $json['success'] && $json['user_name'] === 'E. Aguilar') {
    echo "VERIFICATION PASSED: JSON is valid and contains correct user_name.\n";
} else {
    echo "VERIFICATION FAILED: Invalid JSON or incorrect data.\n";
    echo "JSON Error: " . json_last_error_msg() . "\n";
}
?>
