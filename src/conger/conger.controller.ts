import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { CongerService } from './conger.service';
import { CreateCongerDto } from './dto/create-conger.dto';
import { StatutConge } from './entities/status.enum';

@Controller('api/v1/conger')
export class CongerController {
  constructor(private readonly congerService: CongerService) {}

  @Post()
  create(@Body() createCongerDto: CreateCongerDto) {
    return this.congerService.create(createCongerDto);
  }

  @Get()
  findAll() {
    return this.congerService.findAll();
  }

  @Put('updateStatut/:id')
  async updateStatut(@Param('id') id: string, @Body('statut') statut: StatutConge) {
    try {
      return await this.congerService.updateStatut(Number(id), statut);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  }
}
