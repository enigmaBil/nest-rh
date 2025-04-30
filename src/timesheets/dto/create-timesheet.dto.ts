import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTimesheetDto {
  @ApiProperty()
  @IsDateString()
  date: Date;

  @IsString()
  @ApiProperty()
  startTime: string;

  @IsString()
  @ApiProperty()
  endTime: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @ApiProperty()
  totalHours: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;
}
