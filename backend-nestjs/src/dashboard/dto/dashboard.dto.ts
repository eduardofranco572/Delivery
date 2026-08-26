import { IsOptional, IsString } from 'class-validator';

export class DashboardFilterDto {
    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;
}

export class DashboardMetricsDto {
    totalRevenue!: number;
    totalOrders!: number;
    averageTicket!: number;
    totalCustomers!: number;
    chartData!: number[];
    chartLabels!: string[];
}