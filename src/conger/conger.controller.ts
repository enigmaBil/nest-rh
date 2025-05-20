/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Param, Body, BadRequestException, Logger, NotFoundException, Delete } from '@nestjs/common';
import { CongerService } from './conger.service';
import { CreateCongerDto } from './dto/create-conger.dto';
import { StatutConge } from './entities/status.enum';


@Controller('api/v1/conger')
export class CongerController {
  private readonly logger = new Logger(CongerController.name);

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
      if (!Object.values(StatutConge).includes(statut)) {
        throw new BadRequestException('Statut invalide');
      }
      return await this.congerService.updateStatut(Number(id), statut);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Erreur lors de la mise à jour du statut : ${error.message}`);
      } else {
        this.logger.error('Erreur lors de la mise à jour du statut : Une erreur inconnue est survenue');
      }
      throw error;
    }
  }


  @Delete(':id')  // ✅ ici, propre et correct !
  deleteConger(@Param('id') id: number) {
    return this.congerService.remove(id);
  }


}
