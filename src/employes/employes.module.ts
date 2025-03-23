import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployesService } from './employes.service';
import { EmployesController } from './employes.controller';
import { Employe } from './entities/employe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employe])],
  providers: [EmployesService],
  controllers: [EmployesController],
})
export class EmployesModule {}
