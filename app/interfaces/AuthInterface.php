<?php

namespace App\interfaces;

use Illuminate\Http\Request;

interface AuthInterface
{
    /**
     * checkIfAuthenticated
     * 
     * Check if an user is authenticated or not by request
     *
     * @param Request $request
     * @return bool -> true if authenticated, false if not
     */
    public function checkIfAuthenticated(Request $request);

    /**
     * registerUser
     * 
     * Register an user by request
     *
     * @param Request $request
     * @return mixed
     */
    public function registerUser(Request $request);

    /**
     * findUserByEmailAddress
     * 
     * Find user by email address
     *
     * @param string $email
     * @return mixed
     */
    public function findUserByEmailAddress($email);
}
