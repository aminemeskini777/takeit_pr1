<?php

namespace App\Console\Commands;

use App\Http\Controllers\BadgeController;
use Illuminate\Console\Command;

class CheckBadgesCommand extends Command
{
    protected $signature = 'badges:check';
    protected $description = 'Vérifie et attribue automatiquement les badges';

    public function handle()
    {
        $controller = new BadgeController();
        $result = $controller->verificationAutomatique();

        $this->info($result->getData()->message);
        return Command::SUCCESS;
    }
}
