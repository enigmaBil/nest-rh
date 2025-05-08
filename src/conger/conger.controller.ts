/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
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


  @Patch(':id')
  async updateStatut(
    @Param('id') id: string,
    @Body() updateData: { statut: StatutConge }, // ⚠️ Ce champ doit s'appeler exactement "statut"
  ) {
    return this.congerService.updateStatut(Number(id), updateData.statut);
  }

}
