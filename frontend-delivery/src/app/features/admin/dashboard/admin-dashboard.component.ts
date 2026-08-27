import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgApexchartsModule, ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexTooltip, ApexDataLabels, ApexTheme, ApexYAxis } from "ng-apexcharts";
import { AdminService, DashboardMetrics } from './admin-dashboard.service';
import { AlertService } from '../../../core/services/alert.service';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    theme: ApexTheme;
    colors: string[];
};

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, NgSelectModule, FlatpickrModule, NgApexchartsModule],
    templateUrl: './admin-dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions!: Partial<ChartOptions>;

    metrics: DashboardMetrics | null = null;
    isLoading = true;
    isMobile = false;

    quickFilter: string = 'all';
    startDate: string = '';
    endDate: string = '';

    constructor(
        private adminService: AdminService, 
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {
        this.checkScreenSize();
    }

    ngOnInit() {
        this.loadMetrics();
    }

    @HostListener('window:resize')
    onResize() {
        this.checkScreenSize();
    }

    checkScreenSize() {
        this.isMobile = window.innerWidth < 1024; 
    }

    applyQuickFilter() {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        const today = new Date();
        
        if (this.quickFilter === '30d') {
            const last30 = new Date();
            last30.setDate(today.getDate() - 30);
            
            this.startDate = last30.toISOString().split('T')[0];
            this.endDate = today.toISOString().split('T')[0];

        } else if (this.quickFilter === '1y') {
            const lastYear = new Date();
            lastYear.setFullYear(today.getFullYear() - 1);

            this.startDate = lastYear.toISOString().split('T')[0];
            this.endDate = today.toISOString().split('T')[0];

        } else if (this.quickFilter === 'all') {
            this.startDate = '';
            this.endDate = '';
        }
        
        this.loadMetrics();
    }

    loadMetrics() {
        this.isLoading = true;
        this.cdr.detectChanges();

        this.adminService.getDashboardMetrics(this.startDate, this.endDate).subscribe({
            next: (data) => {
                this.metrics = data;

                if (!this.isMobile) {
                    this.initChart(data.chartData, data.chartLabels);
                }
                
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar a dashboard.');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    initChart(data: number[], labels: string[]) {
        this.chartOptions = {
            series: [{ name: "Faturamento (R$)", data: data }],
            chart: { type: "area", height: 350, toolbar: { show: false }, background: 'transparent' },
            colors: ['#F97D14'],
            stroke: { curve: "smooth", width: 3 },
            dataLabels: { enabled: false },
            theme: { mode: 'dark' },
            xaxis: {
                categories: labels,
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: { formatter: (value) => `R$ ${value.toFixed(2)}` }
            },
            tooltip: { theme: "dark" }
        };
    }
}