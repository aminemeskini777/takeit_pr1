<?php

use App\Http\Middleware\RoleMiddleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->use([\Illuminate\Http\Middleware\HandleCors::class]);

        // Keep default Laravel auth middleware aliases; only add custom role alias.
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, Request $request) {
            $status = 500;

            if ($e instanceof ValidationException) {
                $status = 422;
            } elseif ($e instanceof AuthenticationException) {
                $status = 401;
            } elseif ($e instanceof AuthorizationException) {
                $status = 403;
            } elseif ($e instanceof ModelNotFoundException) {
                $status = 404;
            } elseif ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();
            } elseif ($e instanceof HttpResponseException) {
                $status = $e->getResponse()->getStatusCode();
            }

            return response()->json([
                'message' => $e->getMessage(),
            ], $status);
        });
    })
    ->create();
