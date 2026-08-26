import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminTableComponent, TableColumn } from '../components/admin-table/admin-table.component';
import { AdminGroupService } from './admin-group.service';
import { AlertService } from '../../../core/services/alert.service';
import { Group } from './models/group.models';

@Component({
    selector: 'app-admin-groups',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, AdminTableComponent],
    templateUrl: './admin-groups.component.html'
})
export class AdminGroupsComponent implements OnInit {
    groups: Group[] = [];
    isLoading = true;
    isLoadingMore = false;

    currentPage = 1;
    pageSize = 50;
    hasMore = false;
    searchQuery = '';
    searchSubject = new Subject<string>();

    groupColumns: TableColumn[] = [
        { key: 'id', label: 'ID', type: 'text' }, 
        { key: 'name', label: 'Nome do Grupo', type: 'text' }
    ];

    constructor(
        private router: Router,
        private groupService: AdminGroupService,
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
            this.groups = [];
            this.loadGroups();
        });

        this.loadGroups();
    }

    ngOnDestroy() {
        this.searchSubject.complete();
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchSubject.next(target.value);
    }

    loadGroups() {
        if (this.currentPage === 1) {
            this.isLoading = true;
        } else {
            this.isLoadingMore = true;
        }

        this.groupService.getGroups(this.currentPage, this.pageSize, this.searchQuery).subscribe({
            next: (response) => {
                if (this.currentPage === 1) {
                    this.groups = response.data;
                } else {
                    this.groups = [...this.groups, ...response.data];
                }
                
                this.hasMore = this.groups.length < response.total;
                
                this.isLoading = false;
                this.isLoadingMore = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar os grupos.');
                this.isLoading = false;
                this.isLoadingMore = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadMore() {
        this.currentPage++;
        this.loadGroups();
    }

    goToNew() {
        this.router.navigate(['/admin/groups/novo']);
    }

    goToEdit(id: number) {
        this.router.navigate(['/admin/groups', id]);
    }
}