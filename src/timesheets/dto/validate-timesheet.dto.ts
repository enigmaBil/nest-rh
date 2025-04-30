import { PartialType } from '@nestjs/mapped-types';
import { CreateTimesheetDto } from './create-timesheet.dto';
import { IsEnum, IsString } from 'class-validator';
import { TimesheetStatusEnum } from 'src/common/timesheet-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateTimesheetDto extends PartialType(CreateTimesheetDto) {
  @IsEnum(TimesheetStatusEnum)
  @ApiProperty()
  status: TimesheetStatusEnum;
  @IsString()
  @ApiProperty()
  comment?: string;
}
