import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardFilterDto, DashboardMetricsDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}

    async getDashboardMetrics(filters: DashboardFilterDto): Promise<DashboardMetricsDto> {
        let dateFilter: any = {};
        
        if (filters.startDate || filters.endDate) {
            dateFilter.createdAt = {};
            
            if (filters.startDate) {
                dateFilter.createdAt.gte = new Date(`${filters.startDate}T00:00:00.000Z`);
            }

            if (filters.endDate) {
                dateFilter.createdAt.lte = new Date(`${filters.endDate}T23:59:59.999Z`);
            }
        }

        const orders = await this.prisma.order.findMany({
            where: { 
                ...dateFilter, 
                status: { not: 'CANCELLED' } 
            },
            select: { 
                total: true, 
                createdAt: true 
            },
            orderBy: { createdAt: 'asc' }
        });

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
        const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        const totalCustomers = await this.prisma.user.count({
            where: { 
                isAdmin: false, 
                ...dateFilter 
            }
        });

        const chartData = orders.map(o => parseFloat(o.total.toFixed(2)));
        const chartLabels = orders.map(o => o.createdAt.toLocaleDateString('pt-BR'));

        return {
            totalRevenue,
            totalOrders,
            averageTicket,
            totalCustomers,
            chartData: chartData.length ? chartData : [0],
            chartLabels: chartLabels.length ? chartLabels : ['Sem dados']
        };
    }
}