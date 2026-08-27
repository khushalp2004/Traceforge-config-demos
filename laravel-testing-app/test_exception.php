<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$client = $app->make(\TraceForge\TraceForgeClient::class);
echo "Configured: " . ($client->isConfigured() ? "Yes" : "No") . "\n";

try {
    throw new Exception("Test Exception for TraceForge 2");
} catch (\Throwable $e) {
    echo "Reporting...\n";
    $client->captureException($e, ['framework' => 'laravel', 'type' => 'test_exception']);
}
echo "Exception reported via Client directly.\n";
