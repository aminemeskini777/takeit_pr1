<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $total = Task::count();
        $done = Task::where('status', 'done')->count();

        return response()->json([
            'tickets' => $total,
            'jira' => 0,
            'internal' => $total,
            'done' => $done,
        ]);
    }

    public function topEmployees()
    {
        $employees = User::where('role', 'employee')
            ->select('users.id', 'users.name')
            ->leftJoin('task_user', 'users.id', '=', 'task_user.user_id')
            ->leftJoin('tasks', 'task_user.task_id', '=', 'tasks.id')
            ->selectRaw('COUNT(CASE WHEN tasks.status = "done" THEN 1 END) as tasks')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('tasks')
            ->limit(6)
            ->get();

        return response()->json($employees);
    }

    public function evolution()
    {
        $rows = Task::select(
                DB::raw("DATE_FORMAT(updated_at, '%Y-%m') as month"),
                DB::raw("COUNT(*) as tasksDone")
            )
            ->where('status', 'done')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($rows);
    }

    public function employeeDetail($id)
    {
        $employee = User::select('id', 'name')
            ->where('role', 'employee')
            ->findOrFail($id);

        $total = DB::table('task_user')
            ->where('user_id', $employee->id)
            ->count();

        $done = DB::table('task_user')
            ->join('tasks', 'task_user.task_id', '=', 'tasks.id')
            ->where('task_user.user_id', $employee->id)
            ->where('tasks.status', 'done')
            ->count();

        $progress = $total > 0 ? round(($done / $total) * 100) . '%' : '0%';

        $history = Task::select('tasks.id', 'tasks.title', 'tasks.status', 'tasks.created_at')
            ->join('task_user', 'tasks.id', '=', 'task_user.task_id')
            ->where('task_user.user_id', $employee->id)
            ->orderByDesc('tasks.created_at')
            ->limit(6)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'source' => 'interne',
                    'createdAt' => $task->created_at->format('Y-m-d'),
                ];
            });

        return response()->json([
            'name' => $employee->name,
            'tasks' => $done,
            'badges' => [],
            'progress' => $progress,
            'history' => $history,
        ]);
    }
}
