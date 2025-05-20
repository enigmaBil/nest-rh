import { Controller, Post, Body, Get, Param, Delete, Patch, Query, ParseIntPipe, UseGuards, Req, Res, ParseEnumPipe } from '@nestjs/common';
import { TimesheetsService } from './timesheets.service';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { ValidateTimesheetDto } from './dto/validate-timesheet.dto';
import { TimesheetStatusEnum } from 'src/common/timesheet-status.enum';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/common/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';

@Controller('api/v1/timesheets')
@ApiBearerAuth()
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  async create(@Body() createTimesheetDto: CreateTimesheetDto, @Req() req) {
    const result = await this.timesheetsService.createTimesheet(createTimesheetDto, req.user.id)
    return instanceToPlain(result);
  }

  @Get('my-timesheets')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'The records have been successfully retrieved.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  async findByStatus(@Req() req, @Query('status', new ParseEnumPipe(TimesheetStatusEnum)) status: TimesheetStatusEnum) {
    const result = await this.timesheetsService.findByStatus(req.user.id, status)
    return instanceToPlain(result);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'The records have been successfully retrieved.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  async findAll() {
    const result = await this.timesheetsService.findAllTimesheets()
    return instanceToPlain(result);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The records have been successfully retrieved.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.timesheetsService.findOneTimesheet(id)
    return instanceToPlain(result);
  }

  @Get('employee/:id')
  @ApiResponse({ status: 200, description: 'The records have been successfully retrieved.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  async findByEmploye(@Param('id', ParseIntPipe) id: number){
    const result = await this.timesheetsService.findByEmployeID(id)
    return instanceToPlain(result);
  }

  @Patch(':id/validate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RH)
  @ApiResponse({ status: 200, description: 'The records have been successfully retrieved.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  async validate(@Param('id', ParseIntPipe) id: number, @Body() dto: ValidateTimesheetDto,) {
    const result = await this.timesheetsService.validateTimesheet(id, dto)
    return instanceToPlain(result);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.timesheetsService.remove(id);
  }

  @Get('export')
  @UseGuards(AuthGuard('jwt'))
  async exportTimesheets(@Res() res: Response) {
    const buffer = await this.timesheetsService.exportAllToExcel();
    res.setHeader('Content-Disposition', 'attachment; filename=timesheets.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.end(buffer);
  }
}
