import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Controller('admin/preferences')
export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) {}

    @Post()
    create(@Body() createPreferenceDto: CreatePreferenceDto) {
        return this.preferencesService.create(createPreferenceDto);
    }

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.preferencesService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 50,
            search
        );
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.preferencesService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updatePreferenceDto: UpdatePreferenceDto
    ) {
        return this.preferencesService.update(id, updatePreferenceDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.preferencesService.remove(id);
    }
}