import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
@Controller('api/v1/evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  async create(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationsService.create(createEvaluationDto);
  }

  // ✅ Toujours placer AVANT les routes génériques
  @Get('employee/:id')
  async findByEmployeeId(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.findByEmployeeId(id);
  }

  @Get()
  async findAll() {
    return this.evaluationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEvaluationDto) {
    return this.evaluationsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationsService.remove(id);
  }
}
