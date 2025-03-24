import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CongerService } from './conger.service';
import { CreateCongerDto } from './dto/create-conger.dto';
import { Conger } from './entities/conger.entity';

@Controller('conger')
export class CongerController {
  constructor(private readonly congerService: CongerService) {}

  // Ajouter 
  @Post()
  create(@Body() createCongerDto: CreateCongerDto): Promise<Conger> {
    return this.congerService.create(createCongerDto);
  }

  // Afficher 
  @Get()
  findAll(): Promise<Conger[]> {
    return this.congerService.findAll();
  }

  // Modifier 
  @Put(':id')
  update(@Param('id') id: number, @Body() updateCongerDto: CreateCongerDto): Promise<Conger> {
    return this.congerService.update(id, updateCongerDto);
  }

  // Supprimer un congé
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.congerService.remove(id);
  }

  // Filtrer 
  @Get('filterByType')
  filterByType(@Query('type') type: string): Promise<Conger[]> {
    return this.congerService.filterCongersByType(type);
  }
}
