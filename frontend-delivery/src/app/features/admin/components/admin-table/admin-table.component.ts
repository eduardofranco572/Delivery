import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../../environments/environment';

export interface TableColumn {
    key: string;
    label: string;
    type?: 'text' | 'currency' | 'image-text';
    imageKey?: string;
}

@Component({
    selector: 'app-admin-table',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './admin-table.component.html'
})
export class AdminTableComponent {
    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() isLoading: boolean = false;
    @Input() emptyMessage: string = 'Nenhum registro encontrado.';
    @Input() emptyIcon: string = 'clipboard-list';

    @Output() rowClick = new EventEmitter<any>();

    baseUrl = environment.apiUrl.replace('/api', '');

    onRowClick(item: any) {
        this.rowClick.emit(item);
    }
}