import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('admin/groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.groupsService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 50,
            search
        );
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.groupsService.findOne(id);
    }

    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.create(createGroupDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateGroupDto: UpdateGroupDto
    ) {
        return this.groupsService.update(id, updateGroupDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.groupsService.remove(id);
    }
}