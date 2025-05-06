import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsMilitaryTime, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTimesheetDto {
  @IsDateString({ strict: true })
  @ApiProperty({ example: '2025-05-04' })
  date: Date;

  @IsMilitaryTime({ message: 'startTime must be in military time format (HH:mm)' })
  @ApiProperty({ example: '08:00' })
  startTime: string;

  @IsMilitaryTime({ message: 'endTime must be in military time format (HH:mm)' })
  @ApiProperty({ example: '17:00' })
  endTime: string;

  @IsNumber()
  @ApiProperty({ example: 8 })
  totalHours: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Travail quotidien' })
  description?: string;
}
