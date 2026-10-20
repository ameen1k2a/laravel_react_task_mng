<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\repositories\TaskRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TasksController extends Controller
{
    public $TaskRepository;

    public function __construct(TaskRepository $TaskRepository)
    {
        $this->TaskRepository = $TaskRepository;
    }

    /**
     * index() Get all Task List
    *
    * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $Tasks = $this->TaskRepository->getAll($request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Task List',
            'data'    => $Tasks
        ]);
    }

    /**
     * show() Find Task By ID
     *
    * @param int $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $Task = $this->TaskRepository->findById($id, $request->user()->id);
        if (is_null($Task)) {
            return response()->json([
                'success' => false,
                'message' => 'Task Details',
                'data'    => null
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'Task Details',
            'data'    => $Task
        ]);
    }

    /**
     * store() Create New Task
     *
    * @param Request $request
    * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $formData = $request->all();
        $validator = Validator::make($formData, [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'project_id' => 'required|integer|exists:projects,id',
        ], [
            'name.required' => 'Please give Task name',
            'description.required' => 'Please give Task description',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
                'errors' => $validator->getMessageBag(),
            ]);
        }

        $project = Project::where('user_id', $request->user()->id)->find($request->project_id);
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found',
                'data' => null,
            ], 404);
        }

        $Task = $this->TaskRepository->create($request);
        return response()->json([
            'success' => true,
            'message' => 'Task Stored',
            'data'    => $Task
        ]);
    }

    /**
     * update() Update Task by id
     *
     * @param Request $request
    * @param int $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $Task = $this->TaskRepository->findById($id, $request->user()->id);
        if (is_null($Task)) {
            return response()->json([
                'success' => false,
                'message' => 'Task Not found',
                'data' => null,
            ]);
        }

        $formData = $request->all();
        $validator = Validator::make($formData, [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'project_id' => 'required|integer|exists:projects,id',
            'status' => 'sometimes|boolean',
        ], [
            'name.required' => 'Please give Task name',
            'description.required' => 'Please give Task description',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
                'errors' => $validator->getMessageBag(),
            ]);
        }

        $project = Project::where('user_id', $request->user()->id)->find($request->project_id);
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found',
                'data' => null,
            ], 404);
        }

        $Task = $this->TaskRepository->edit($request, $id);
        return response()->json([
            'success' => true,
            'message' => 'Task Updated',
            'data'    => $Task
        ]);
    }

    /**
     * destry() Delete a Task
     *
    * @param int $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $Task = $this->TaskRepository->findById($id, $request->user()->id);
        if (is_null($Task)) {
            return response()->json([
                'success' => false,
                'message' => 'Task Not found',
                'data' => null,
            ]);
        }

        $Task = $this->TaskRepository->delete($id, $request->user()->id);
        return response()->json([
            'success' => true,
            'message' => 'Task Deleted',
            'data'    => $Task
        ]);
    }
}
