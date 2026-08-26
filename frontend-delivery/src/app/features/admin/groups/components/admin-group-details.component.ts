import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { AdminGroupService } from '../admin-group.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
    selector: 'app-admin-group-details',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, FormInputComponent],
    templateUrl: './admin-group-details.component.html'
})
export class AdminGroupDetailsComponent implements OnInit {
    groupForm: FormGroup;
    isEditMode = false;
    groupId!: number;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private groupService: AdminGroupService,
        private alertService: AlertService
    ) {
        this.groupForm = this.fb.group({
            name: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id && id !== 'novo') {
                this.isEditMode = true;
                this.groupId = Number(id);
                this.loadData(this.groupId);
            }
        });
    }

    loadData(id: number) {
        this.groupService.getGroupById(id).subscribe({
            next: (data) => {
                this.groupForm.patchValue(data);
            },
            error: () => this.alertService.error('Erro', 'Não foi possível carregar os dados.')
        });
    }

    saveGroup() {
        if (this.groupForm.invalid) {
            this.alertService.warning('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }
        
        this.isSaving = true;
        const payload = this.groupForm.value;

        const request$ = this.isEditMode 
            ? this.groupService.updateGroup(this.groupId, payload)
            : this.groupService.createGroup(payload);

        request$.subscribe({
            next: () => {
                this.alertService.success('Sucesso', 'Grupo salvo com sucesso!');
                this.isSaving = false;
                this.goBack();
            },
            error: (err) => {
                this.alertService.error('Erro', err.error?.message || 'Falha ao salvar.');
                this.isSaving = false;
            }
        });
    }

    deleteGroup() {
        if (!this.groupId) return;

        if (confirm('Tem certeza que deseja excluir este grupo? As preferências vinculadas podem ser afetadas.')) {
            this.groupService.deleteGroup(this.groupId).subscribe({
                next: () => {
                    this.alertService.success('Excluído', 'Grupo removido com sucesso!');
                    this.goBack();
                },
                error: () => {
                    this.alertService.error('Erro', 'Não foi possível excluir o grupo.')
                } 
            });
        }
    }

    goBack() {
        this.location.back();
    }
}