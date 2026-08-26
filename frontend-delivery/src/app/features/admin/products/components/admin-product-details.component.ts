import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminProductService } from '../admin-product.service';
import { AlertService } from '../../../../core/services/alert.service';
import { environment } from '../../../../../environments/environment';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';

@Component({
    selector: 'app-admin-product-details',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, NgSelectModule, FormInputComponent],
    templateUrl: './admin-product-details.component.html'
})
export class AdminProductDetailsComponent implements OnInit {
    productForm: FormGroup;
    isEditMode = false;
    productId!: number;
    isSaving = false;
    categories: any[] = [];
    addCustomCategory = (term: string) => ({ catName: term });
    
    imagePreview: string | null = null;
    selectedFile: File | null = null;
    preferenceGroups: any[] = [];
    baseUrl = environment.apiUrl.replace('/api', '');

    constructor(
        private fb: FormBuilder,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private productService: AdminProductService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {
        this.productForm = this.fb.group({
            prodCode: ['', Validators.required],
            prodName: ['', Validators.required],
            prodType: [''],
            prodGroup: ['', Validators.required],
            prodSize: [''],
            prodOriginalPrice: ['', Validators.required],
            preferenceGroupId: [null],
            prodDescription: ['']
        });
    }

    ngOnInit() {
        this.loadPreferenceGroups();
        this.loadCategories();

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id && id !== 'novo') {
                this.isEditMode = true;
                this.productId = Number(id);
                this.loadProductData(this.productId);
            }
        });
    }

    loadCategories() {
        this.productService.getCategories().subscribe({
            next: (cats) => this.categories = cats,
            error: () => console.error('Erro ao carregar categorias')
        });
    }

    loadPreferenceGroups() {
        this.productService.getPreferenceGroups().subscribe({
            next: (groups) => this.preferenceGroups = groups,
            error: () => console.error('Erro ao carregar grupos de preferência')
        });
    }

    loadProductData(id: number) {
        this.productService.getProductById(id).subscribe({
            next: (data: any) => {
                let formattedPrice = '';
                if (data.prodOriginalPrice) {
                    formattedPrice = data.prodOriginalPrice.toFixed(2).replace('.', ',');
                }

                let prefGroupId = null;
                if (data.preferenceGroups) {
                    if (Array.isArray(data.preferenceGroups) && data.preferenceGroups.length > 0) {
                        prefGroupId = data.preferenceGroups[0].id;

                    } else if (!Array.isArray(data.preferenceGroups) && data.preferenceGroups.id) {
                        prefGroupId = data.preferenceGroups.id;
                    }
                }

                this.productForm.patchValue({
                    ...data,
                    prodOriginalPrice: formattedPrice,
                    preferenceGroupId: prefGroupId
                });

                if (data.prodImageUrl) {
                    this.imagePreview = `${this.baseUrl}/uploads/company/products/imgs/${data.prodImageUrl}`;
                }
                
                this.cdr.detectChanges();
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar os dados do produto.');
            }
        });
    }

    onImageSelected(event: any) {
        const file = event.target.files[0];

        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();

            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
                this.cdr.detectChanges();
            };

            reader.readAsDataURL(file);
        }
    }

    onPriceInput(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');

        if (!value) {
            this.productForm.patchValue({ prodOriginalPrice: '' });
            return;
        }

        const numberValue = (parseInt(value, 10) / 100).toFixed(2);
        
        const formattedValue = numberValue
            .replace('.', ',') 
            .replace(/\B(?=(\d{3})+(?!\d))/g, "."); 

        this.productForm.patchValue({ prodOriginalPrice: formattedValue }, { emitEvent: false });
    }

    saveProduct() {
        if (this.productForm.invalid) {
            this.alertService.warning('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }

        this.isSaving = true;
        const formData = new FormData();
        const formValues = this.productForm.value;

        Object.keys(formValues).forEach(key => {
            if (formValues[key] !== null && formValues[key] !== '') {
                let finalValue = formValues[key];
                
                if (key === 'prodOriginalPrice' && typeof finalValue === 'string') {
                    finalValue = finalValue.replace(/\./g, '').replace(',', '.');
                }
                
                formData.append(key, finalValue);
            }
        });

        if (this.selectedFile) {
            formData.append('image', this.selectedFile);
        }

        const request$ = this.isEditMode 
            ? this.productService.updateProduct(this.productId, formData)
            : this.productService.createProduct(formData);

        request$.subscribe({
            next: () => {
                this.alertService.success('Sucesso', `Produto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
                this.isSaving = false;
                this.goBack();
            },
            error: (err) => {
                const mensagemErro = err.error?.message || 'Falha ao salvar o produto.';
                this.alertService.error('Erro', mensagemErro);
                this.isSaving = false;
            }
        });
    }

    deleteProduct() {
        if (!this.productId) return;
        
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.productService.deleteProduct(this.productId).subscribe({
                next: () => {
                    this.alertService.success('Excluído', 'Produto removido com sucesso!');
                    this.goBack();
                },
                error: () => this.alertService.error('Erro', 'Não foi possível excluir.')
            });
        }
    }

    goBack() {
        this.location.back();
    }
}