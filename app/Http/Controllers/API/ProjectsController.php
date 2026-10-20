<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\repositories\ProjectRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectsController extends Controller
{
    public $projectRepository;

    public function __construct(ProjectRepository $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    /**
     * index() Get all project List
    *
    * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $projects = $this->projectRepository->getAll($request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Project List',
            'data'    => $projects
        ]);
    }

    /**
     * show() Find Project By ID
     *
    * @param int $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $project = $this->projectRepository->findById($id, $request->user()->id);
        if (is_null($project)) {
            return response()->json([
                'success' => false,
                'message' => 'Project Details',
                'data'    => null
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'Project Details',
            'data'    => $project
        ]);
    }

    /**
     * store() Create New Project
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
        ], [
            'name.required' => 'Please give project name',
            'description.required' => 'Please give project description',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
                'errors' => $validator->getMessageBag(),
            ]);
        }

        $project = $this->projectRepository->create($request);
        return response()->json([
            'success' => true,
            'message' => 'Project Stored',
            'data'    => $project
        ]);
    }

    /**
     * update() Update project by id
     *
     * @param Request $request
    * @param int $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $project = $this->projectRepository->findById($id, $request->user()->id);
        if (is_null($project)) {
            return response()->json([
                'success' => false,
                'message' => 'Project Not found',
                'data' => null,
            ]);
        }

        $formData = $request->all();
        $validator = Validator::make($formData, [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'sometimes|boolean',
        ], [
            'name.required' => 'Please give project name',
            'description.required' => 'Please give project description',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
                'errors' => $validator->getMessageBag(),
            ]);
        }

        $project = $this->projectRepository->edit($request, $id);
        return response()->json([
            'success' => true,
            'message' => 'Project Updated',
            'data'    => $project
        ]);
    }

    /**
     * destry() Delete a Project
     *
    * @param int $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $project = $this->projectRepository->findById($id, $request->user()->id);
        if (is_null($project)) {
            return response()->json([
                'success' => false,
                'message' => 'Project Not found',
                'data' => null,
            ]);
        }

        $project = $this->projectRepository->delete($id, $request->user()->id);
        return response()->json([
            'success' => true,
            'message' => 'Project Deleted',
            'data'    => $project
        ]);
    }
}
