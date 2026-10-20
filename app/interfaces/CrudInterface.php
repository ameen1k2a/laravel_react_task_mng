<?php

namespace App\interfaces;

use Illuminate\Http\Request;

interface CrudInterface
{
    public function getAll($userId = null);
    public function findById($id, $userId = null);
    public function create(Request $request);
    public function edit(Request $request, $id);
    public function delete($id, $userId = null);
}
