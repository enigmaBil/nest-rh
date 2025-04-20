import { Controller, Get, Param, Post, Body, Delete, Put, Query } from '@nestjs/common';  
import { EmployesService } from './employes.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { Employe } from './entities/employe.entity';

@Controller('employes')
export class EmployesController {
  constructor(private readonly employesService: EmployesService) {}

  @Post()
  async create(@Body() createEmployeDto: CreateEmployeDto): Promise<Employe> {
    return this.employesService.create(createEmployeDto);
  }

  @Get()
  async findAll(): Promise<Employe[]> {
    return this.employesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Employe> {
    return this.employesService.findOne(id);
  }

  @Delete(':id')  
  async remove(@Param('id') id: number): Promise<void> {
    return this.employesService.remove(id);
  }

  @Put(':id')  
  async update(
    @Param('id') id: number,
    @Body() createEmployeDto: CreateEmployeDto,
  ): Promise<Employe> {
    return this.employesService.update(id, createEmployeDto);
  }

  @Get('search')
  async search(@Query('nom') nom: string): Promise<Employe[]> {
    return this.employesService.searchByName(nom);
  }
}
