# Laravel React Task Management

A task and project management application built with Laravel 12, React 18, React Bootstrap, Vite, and MySQL. The API uses Laravel Passport bearer tokens for authentication. Authenticated users can manage their own projects and tasks and view an at-a-glance dashboard.

## Requirements

- PHP 8.2 or newer with required Laravel extensions enabled
- Composer 2
- Node.js 20.19+ or 22.12+ and npm
- MySQL 8+ (or a compatible MySQL/MariaDB server)
- On Windows, XAMPP can provide PHP and MySQL; ensure `php`, `composer`, `node`, and `npm` are available in the terminal `PATH`

## Project setup

1. Clone or download the repository and open a terminal in the project directory.
2. Install the PHP and JavaScript dependencies:

	```bash
	composer install
	npm install
	```

3. Create the local environment file and generate the Laravel application key:

	```bash
	# Windows PowerShell
	Copy-Item .env.example .env
	php artisan key:generate
	```

	On macOS/Linux, use `cp .env.example .env` in place of `Copy-Item`.

4. Create a MySQL database (default name: `laravel_react_task_mng`) and configure the database values in `.env` as described below.
5. Run the migrations and prepare Passport:

	```bash
	php artisan migrate
	php artisan passport:install
	```

	Passport creates the OAuth tables/clients and its signing keys. Keep the generated `storage/oauth-private.key`, `storage/oauth-public.key`, and any client credentials private; do not commit them. If keys need to be regenerated, use `php artisan passport:keys` and create the personal access client required for issuing tokens with `php artisan passport:client --personal`.

6. Start the application using either the combined development command or separate terminals.

## Database setup (MySQL)

Create the database before running migrations. For example, from the MySQL client:

```sql
CREATE DATABASE laravel_react_task_mng CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Set the matching connection values in `.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_react_task_mng
DB_USERNAME=root
DB_PASSWORD=
```

Use the username and password configured for your local MySQL installation. Do not put real production credentials in this README or commit `.env`.

To initialize or update the schema after changing migrations:

```bash
php artisan migrate
```

Optional demo user seeding:

```bash
php artisan db:seed
```

The seeder creates `test@example.com` with the local demo password `password` (stored hashed). This is for local development only; use the registration screen to create a different account, and never use the demo credentials in production.

## Environment variables

`.env.example` is the template; copy it to `.env` and adjust values for your machine. Main settings:

| Variable | Purpose | Local default/example |
| --- | --- | --- |
| `APP_NAME` | Application display name | `Laravel` |
| `APP_ENV` | Environment | `local` |
| `APP_KEY` | Encryption key (generate with `php artisan key:generate`) | Generated value |
| `APP_DEBUG` | Detailed local error pages; disable in production | `true` |
| `APP_URL` | Laravel application URL | `http://localhost` |
| `DB_CONNECTION` | Database driver | `mysql` |
| `DB_HOST` / `DB_PORT` | MySQL server address and port | `127.0.0.1` / `3306` |
| `DB_DATABASE` | Database name | `laravel_react_task_mng` |
| `DB_USERNAME` / `DB_PASSWORD` | MySQL credentials | Local MySQL account |
| `BCRYPT_ROUNDS` | Password hashing cost | `12` |
| `PASSPORT_PRIVATE_KEY` / `PASSPORT_PUBLIC_KEY` | Optional Passport key contents when not using key files | Usually unset locally |

Passport normally reads its signing keys from the generated files in `storage/`. Keep `APP_DEBUG=false` and use secure, unique credentials in production.

## Run backend and frontend

### Combined development mode

From the project directory, run:

```bash
composer run dev
```

This repository's Composer `dev` script starts the Laravel server, queue listener, log viewer, and Vite. Open the URL printed by Laravel (typically `http://127.0.0.1:8000`). Stop the combined processes with `Ctrl+C`.

### Start services separately

Alternatively, use two terminals:

**Backend:**

```bash
php artisan serve
```

**Frontend assets:**

```bash
npm run dev
```

Vite serves the React/CSS assets during development through the Laravel Vite integration. For a production asset build, run:

```bash
npm run build
```

## Authentication and API

- Registration and login endpoints are `POST /api/auth/register` and `POST /api/auth/login`.
- Laravel Passport issues OAuth personal access tokens. The frontend saves the returned access token locally and sends it as `Authorization: Bearer <token>` on API requests.
- Project and task API resource endpoints require the `auth:api` Passport guard; records are scoped to the signed-in user's projects.
- The application user model uses Laravel's hashed password cast. Do not store plaintext passwords or expose tokens/Passport keys.
- If setting up Passport manually rather than using `passport:install`, migrate first, generate keys with `php artisan passport:keys`, and create a personal access client with `php artisan passport:client --personal`.

## Tests

Run the Laravel test suite with:

```bash
php artisan test
```

Tests use the SQLite in-memory connection configured in `phpunit.xml`, independently of the local MySQL development database.

## AI assistance disclosure

AI tools were used to assist with visual design ideas and UI styling during this machine test. Application requirements, integration, and final verification were completed as part of the implementation process.
