import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterModule, LucideAngularModule],
    template: `
        <div class="min-h-screen w-full flex flex-col items-center justify-center bg-background text-white p-8">
            <h1 class="text-6xl font-bold mb-2">404</h1>
            <p class="text-subtext text-xl mb-8">Eita, parece que essa página queimou no forno.</p>
            <a routerLink="/home" class="px-8 py-4 rounded-xl font-bold text-white transition-all btn-primary-gradient">
                Voltar para o Início
            </a>
        </div>
    `
})
export class NotFoundComponent {}