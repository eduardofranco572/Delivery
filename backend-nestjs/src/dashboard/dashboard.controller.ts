import { Controller, Get, Query, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardFilterDto } from './dto/dashboard.dto';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    getDashboardMetrics(@Req() req: any, @Query() filters: DashboardFilterDto) {
        if (!req.user.isAdmin) {
            throw new UnauthorizedException('Acesso negado. Apenas administradores.');
        }
        return this.dashboardService.getDashboardMetrics(filters);
    }
}