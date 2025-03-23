/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CongerService } from './conger.service';
import { CreateCongerDto } from './dto/create-conger.dto';
import { Conger } from './entities/conger.entity';

@Controller('conger')
export class CongerController {
  constructor(private readonly congerService: CongerService) {}

  @Post()
  create(@Body() createCongerDto: CreateCongerDto): Promise<Conger> {
    return this.congerService.create(createCongerDto);
  }

  @Get()
  findAll(): Promise<Conger[]> {
    return this.congerService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateCongerDto: CreateCongerDto): Promise<Conger> {
    return this.congerService.update(id, updateCongerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.congerService.remove(id);
  }
}
