import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseEnumPipe, Query, ParseIntPipe, Res } from '@nestjs/common';
import { TimesheetsService } from './timesheets.service';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { ValidateTimesheetDto } from './dto/validate-timesheet.dto';
import passport from 'passport';
import { AuthGuard } from '@nestjs/passport';
import { TimesheetStatusEnum } from 'src/common/timesheet-status.enum';
import { Response } from 'express';

@Controller('timesheets')
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createTimesheetDto: CreateTimesheetDto, @Req() req) {
    return this.timesheetsService.createTimesheet(createTimesheetDto, req.user.id);
  }

  @Get('my-timesheets')
  @UseGuards(AuthGuard('jwt'))
  findByStatus(@Req() req, @Query('status', new ParseEnumPipe(TimesheetStatusEnum)) status: TimesheetStatusEnum) {
    return this.timesheetsService.findByStatus(req.user.id, status);
  }

  @Get()
  findAll() {
    return this.timesheetsService.findAllTimesheets();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.timesheetsService.findOneTimesheet(id);
  }

  @Get('employee/:id')
  findByEmploye(@Param('id', ParseIntPipe) id: number){
    return this.timesheetsService.findByEmployeID(id);
  }

  @Patch(':id/validate')
  @UseGuards(AuthGuard('jwt'))
  validate(@Param('id', ParseIntPipe) id: number, @Body() dto: ValidateTimesheetDto,) {
    return this.timesheetsService.validateTimesheet(id, dto);
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
