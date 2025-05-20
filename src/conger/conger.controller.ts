/* eslint-disable prettier/prettier */
<<<<<<< HEAD
import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
=======
import { Controller, Get, Post, Put, Param, Body, BadRequestException, Logger, NotFoundException, Delete } from '@nestjs/common';
>>>>>>> 91fd208 (version final)
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

<<<<<<< HEAD

  @Patch(':id')
  async updateStatut(
    @Param('id') id: string,
    @Body() updateData: { statut: StatutConge }, // ⚠️ Ce champ doit s'appeler exactement "statut"
  ) {
    return this.congerService.updateStatut(Number(id), updateData.statut);
  }

=======
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


>>>>>>> 91fd208 (version final)
}
