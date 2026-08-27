<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IncidentController extends Controller
{
    public function massAssignmentBroken(Request $request)
    {
        // Vulnerable to mass assignment if $guarded = []
        $user = User::create($request->all());
        
        return response()->json([
            'message' => 'User created (potentially with unintended admin role)',
            'user' => $user
        ]);
    }

    public function massAssignmentFixed(Request $request)
    {
        // Safe assignment
        $user = User::create($request->only(['name', 'email', 'password']));
        
        return response()->json([
            'message' => 'User created safely',
            'user' => $user
        ]);
    }

    public function transactionRollback()
    {
        try {
            DB::transaction(function () {
                $user = User::create([
                    'name' => 'Transaction User',
                    'email' => 'transaction@example.com',
                    'password' => bcrypt('password'),
                ]);
                
                // Simulate an error that causes a rollback
                throw new \Exception('Simulated error during transaction');
                
                // This won't execute
                $user->posts()->create(['title' => 'Title', 'body' => 'Body']);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction rolled back due to error: ' . $e->getMessage(),
                'userCount' => User::where('email', 'transaction@example.com')->count() // Should be 0
            ]);
        }
    }

    public function fileUpload(Request $request)
    {
        // Simulate file upload validation failure
        $request->validate([
            'document' => 'required|file|mimes:pdf|max:1024',
        ]);

        return response()->json(['message' => 'File uploaded successfully']);
    }

    public function raceConditionBroken(Request $request)
    {
        // Simulated: multiple concurrent requests could read the same initial value
        $user = User::first();
        $currentName = $user->name;
        
        // Simulating a delay where another process might change the value
        usleep(500000); 
        
        $user->name = $currentName . '_appended';
        $user->save();

        return response()->json(['user' => $user]);
    }

    public function raceConditionFixed(Request $request)
    {
        // Fixed using database locking
        DB::transaction(function () {
            $user = User::lockForUpdate()->first();
            $currentName = $user->name;
            
            usleep(500000); 
            
            $user->name = $currentName . '_appended_safely';
            $user->save();
        });

        return response()->json(['user' => User::first()]);
    }
}
