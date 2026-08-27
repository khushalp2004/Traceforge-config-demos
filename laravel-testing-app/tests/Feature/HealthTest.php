<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthTest extends TestCase
{
    public function test_health_endpoint_returns_healthy_status(): void
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200)
                 ->assertJson(['status' => 'healthy']);
    }

    public function test_dashboard_endpoint_returns_metrics(): void
    {
        $response = $this->get('/api/dashboard');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'service', 'status', 'uptime', 'metrics' => [
                         'users', 'memoryUsage', 'cacheStatus', 'activeConnections', 'errorRate'
                     ]
                 ]);
    }
}
