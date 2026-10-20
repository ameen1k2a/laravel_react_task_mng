<?php

namespace App\repositories;

use App\Models\Task;
use App\interfaces\CrudInterface;
use Illuminate\Http\Request;

class TaskRepository implements CrudInterface
{
    public function getAll($userId = null)
    {
        $tasks = Task::whereHas('project', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->orderBy('id', 'desc')->get();
        return $tasks;
    }
    public function findById($id, $userId = null)
    {
        $task = Task::whereHas('project', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->with('project')->find($id);
        return $task;
    }
    public function create(Request $request)
    {
        $task = new Task();
        $task->name = $request->name;
        $task->description = $request->description;
        $task->project_id = $request->project_id;
        $task->save();
        return $task;
    }
    public function edit(Request $request, $id)
    {
        $task = $this->findById($id, $request->user()->id);
        $task->name = $request->name;
        $task->description = $request->description;
        $task->project_id = $request->project_id;
        if ($request->has('status')) {
            $task->status = $request->status;
        }
        $task->save();
        return $task;
    }
    public function delete($id, $userId = null)
    {
        $task = $this->findById($id, $userId);
        if (!$task) {
            return null;
        }
        $task->delete();
        return $task;
    }
}
