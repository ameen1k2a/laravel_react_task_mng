<?php

namespace App\repositories;

use App\Models\Project;
use App\interfaces\CrudInterface;
use Illuminate\Http\Request;

class ProjectRepository implements CrudInterface
{
    public function getAll($userId = null)
    {
        $projects = Project::where('user_id', $userId)
            ->withCount('tasks')->with('tasks')->orderBy('id', 'desc')->get();
        return $projects;
    }
    public function findById($id, $userId = null)
    {
        $project = Project::where('user_id', $userId)->with('tasks')->find($id);
        return $project;
    }
    public function create(Request $request)
    {
        $project = new Project();
        $project->name = $request->name;
        $project->description = $request->description;
        $project->user_id = $request->user()->id;
        $project->save();
        return $project;
    }
    public function edit(Request $request, $id)
    {
        $project = $this->findById($id, $request->user()->id);
        $project->name = $request->name;
        $project->description = $request->description;
        if ($request->has('status')) {
            $project->status = $request->status;
        }
        $project->save();
        return $project;
    }
    public function delete($id, $userId = null)
    {
        $project = $this->findById($id, $userId);
        if (!$project) {
            return null;
        }
        $project->tasks()->delete();
        $project->delete();
        return $project;
    }
}
