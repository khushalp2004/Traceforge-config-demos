<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Jobs\FailingJob;

class ErrorController extends Controller
{
    public function undefinedVariable()
    {
        $user = new \stdClass();
        $user->email = 'test@example.com';
        
        // Simulating the error
        echo $userr->name; // typo intended
    }

    public function nullReference()
    {
        $user = null;
        echo $user->name;
    }

    public function arrayKey()
    {
        $data = ['name' => 'John'];
        echo $data['email'];
    }

    public function jsonDecode(Request $request)
    {
        // Forcing malformed JSON decode
        $invalidJson = '{ "name": "John", }';
        $decoded = json_decode($invalidJson, true, 512, JSON_THROW_ON_ERROR);
        return response()->json($decoded);
    }

    public function database()
    {
        // Force a bad connection config at runtime to simulate connection refused
        config(['database.connections.sqlite.database' => '/non/existent/path/db.sqlite']);
        config(['database.connections.mysql.host' => '255.255.255.255']);
        
        // Attempt query
        DB::table('users')->first();
    }

    public function envMissing()
    {
        $apiKey = env('CRITICAL_API_KEY');
        if (!$apiKey) {
            throw new \RuntimeException('Missing configuration: CRITICAL_API_KEY is not set');
        }
        return response()->json(['key' => $apiKey]);
    }

    public function fileNotFound()
    {
        $content = file_get_contents(storage_path('app/missing.txt'));
        return response()->json(['content' => $content]);
    }

    public function queueFailure()
    {
        // Dispatching a job that intentionally throws an error
        // We will need to create FailingJob
        if (class_exists(FailingJob::class)) {
            dispatch(new FailingJob());
        } else {
            throw new \RuntimeException('FailingJob is not created yet.');
        }

        return response()->json(['message' => 'Job dispatched (will fail)']);
    }

    public function cacheFailure()
    {
        // Force a bad cache config to simulate redis/memcached being down
        config(['database.redis.cache.host' => '255.255.255.255']);
        
        // Attempt cache
        Cache::store('redis')->get('missing_key');
        
        return response()->json(['message' => 'Cache retrieved']);
    }
}
