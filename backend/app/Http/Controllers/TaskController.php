<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::with([
            'creator:id,name',
            'assignees:id,name,email',
            'comments.user:id,name',
        ])->orderByDesc('created_at')->get();

        $employees = User::where('role', 'employee')->select('id', 'name', 'email')->get();

        return response()->json([
            'success' => true,
            'tasks' => $tasks,
            'employees' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:high,medium,low',
            'status' => 'required|in:todo,in_progress,done',
            'assignees' => 'array',
            'assignees.*' => 'exists:users,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:102400|mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,mp4,mov,avi,mkv',
        ]);

        $uploadedAttachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('tasks', 'public');
                $uploadedAttachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'url' => asset('storage/' . $path),
                    'size' => $file->getSize(),
                    'type' => $file->getClientMimeType(),
                ];
            }
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'priority' => $request->priority,
            'status' => $request->status,
            'created_by' => $request->user()->id,
            'attachments' => $uploadedAttachments,
        ]);

        if ($request->assignees) {
            $task->assignees()->sync($request->assignees);
        }

        return response()->json([
            'success' => true,
            'task' => $task->load(['creator:id,name', 'assignees:id,name,email', 'comments.user:id,name']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:high,medium,low',
            'status' => 'required|in:todo,in_progress,done',
            'assignees' => 'array',
            'assignees.*' => 'exists:users,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:102400|mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,mp4,mov,avi,mkv',
            'existing_attachments' => 'nullable|string',
        ]);

        $task = Task::findOrFail($id);

        $existingAttachments = [];
        if ($request->filled('existing_attachments')) {
            $decoded = json_decode($request->existing_attachments, true);
            if (is_array($decoded)) {
                $existingAttachments = $decoded;
            }
        }

        $uploadedAttachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('tasks', 'public');
                $uploadedAttachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'url' => asset('storage/' . $path),
                    'size' => $file->getSize(),
                    'type' => $file->getClientMimeType(),
                ];
            }
        }

        $attachments = array_values(array_merge($existingAttachments, $uploadedAttachments));

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'priority' => $request->priority,
            'status' => $request->status,
            'attachments' => $attachments,
        ]);

        if ($request->assignees !== null) {
            $task->assignees()->sync($request->assignees);
        }

        return response()->json([
            'success' => true,
            'task' => $task->load(['creator:id,name', 'assignees:id,name,email', 'comments.user:id,name']),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tache supprimée',
        ]);
    }

    public function assign(Request $request, $id)
    {
        $request->validate([
            'assignees' => 'required|array',
            'assignees.*' => 'exists:users,id',
        ]);

        $task = Task::findOrFail($id);
        $task->assignees()->sync($request->assignees);

        return response()->json([
            'success' => true,
            'task' => $task->load(['assignees:id,name,email']),
        ]);
    }

    public function addComment(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $task = Task::findOrFail($id);
        $comment = TaskComment::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'comment' => $comment->load('user:id,name'),
        ], 201);
    }
}
