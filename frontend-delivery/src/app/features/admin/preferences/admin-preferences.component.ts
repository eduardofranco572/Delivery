import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminTableComponent, TableColumn } from '../components/admin-table/admin-table.component';
import { AdminPreferenceService } from './admin-preference.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
    selector: 'app-admin-preferences',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, AdminTableComponent],
    templateUrl: './admin-preferences.component.html'
})
export class AdminPreferencesComponent implements OnInit, OnDestroy {
    preferences: any[] = [];
    isLoading = true;
    isLoadingMore = false;

    currentPage = 1;
    pageSize = 50;
    hasMore = false;
    searchQuery = '';
    searchSubject = new Subject<string>();

    preferenceColumns: TableColumn[] = [
        { key: 'prefCode', label: 'Cód.', type: 'text' },
        { key: 'prefName', label: 'Preferência', type: 'text' },
        { key: 'prefType', label: 'Tipo', type: 'text' },
        { key: 'prefPrice', label: 'Valor Adicional', type: 'currency' }
    ];

    constructor(
        private router: Router,
        private preferenceService: AdminPreferenceService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(query => {
            this.searchQuery = query;
            this.currentPage = 1;
            this.preferences = [];
            this.loadPreferences();
        });

        this.loadPreferences();
    }

    ngOnDestroy() {
        this.searchSubject.complete();
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchSubject.next(target.value);
    }

    loadPreferences() {
        if (this.currentPage === 1) {
            this.isLoading = true;
        } else {
            this.isLoadingMore = true;
        }

        this.preferenceService.getPreferences(this.currentPage, this.pageSize, this.searchQuery).subscribe({
            next: (response) => {
                if (this.currentPage === 1) {
                    this.preferences = response.data || [];
                    
                } else {
                    this.preferences = [...this.preferences, ...(response.data || [])];
                }

                this.hasMore = this.preferences.length < response.total;
                this.isLoading = false;
                this.isLoadingMore = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar as preferências.');
                this.isLoading = false;
                this.isLoadingMore = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadMore() {
        this.currentPage++;
        this.loadPreferences();
    }

    goToNew() {
        this.router.navigate(['/admin/preferences/novo']);
    }

    goToEdit(id: number) {
        this.router.navigate(['/admin/preferences', id]);
    }
}