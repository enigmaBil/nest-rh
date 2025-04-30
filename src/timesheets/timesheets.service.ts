import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { ValidateTimesheetDto } from './dto/validate-timesheet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Timesheet } from './entities/timesheet.entity';
import { Repository } from 'typeorm';
import { TimesheetStatusEnum } from '../common/timesheet-status.enum';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TimesheetsService {
  constructor(
    @InjectRepository(Timesheet)
    private timesheetRepository: Repository<Timesheet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createTimesheet(createTimesheetDto: CreateTimesheetDto, employeID: number): Promise<Timesheet> {
    // Vérifier si l'employé existe
    const employee = await this.userRepository.findOneBy({ id: employeID });

    if (!employee) {
      throw new NotFoundException('Employé non trouvé');
    }

    const timesheet = this.timesheetRepository.create({
      ...createTimesheetDto,
      employee,
      status: TimesheetStatusEnum.PENDING,
    });
    return await this.timesheetRepository.save(timesheet);
  }

  async findAllTimesheets(): Promise<Timesheet[]> {
    return await this.timesheetRepository.find(
      {
        relations: ['employee'],
      }
    );
  }

  async findOneTimesheet(id: number): Promise<Timesheet> {
    const timesheet = await this.timesheetRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!timesheet) {
      throw new NotFoundException('Feuille de temps non trouvée');
    }
    return timesheet;
  }

  async  findByEmployeID(employeID: number): Promise<Timesheet[]> {
     // Vérifier si l'employé existe
     const employee = await this.userRepository.findOne({ where: { id: employeID } });

     if (!employee) {
       throw new NotFoundException('Employé non trouvé');
     }
    return await this.timesheetRepository.find({
      where: { employee: { id: employeID } },
      order: {date: 'desc'},
      relations: ['employee'],
    });
  }

  async findAllPending(): Promise<Timesheet[]> {
    return await this.timesheetRepository.find({
      where: {status: TimesheetStatusEnum.PENDING},
      order: {date: 'desc'},
    });
  }

  async findAllApproved(): Promise<Timesheet[]> {
    return await this.timesheetRepository.find({
      where: {status: TimesheetStatusEnum.APPROVED},
      order: {date: 'desc'},
    });
  }

  async findAllRejected(): Promise<Timesheet[]> {
    return await this.timesheetRepository.find({
      where: {status: TimesheetStatusEnum.REJECTED},
      order: {date: 'desc'},
    });
  }

  async findByStatus(employeeId: number, status: TimesheetStatusEnum): Promise<Timesheet[]> {
    const employee = await this.userRepository.findOne({ where: { id: employeeId } });
  
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
  
    return this.timesheetRepository.find({
      where: {
        employee: { id: employeeId },
        status,
      },
      relations: ['employee'],
    });
  }

  async validateTimesheet(id: number, validateTimesheetDto: ValidateTimesheetDto): Promise<Timesheet> {
      const timesheet = await this.timesheetRepository.findOne({
        where: { id },
        relations: ['employee'],
      });

      if (!timesheet) {
        throw new NotFoundException('Feuille de temps non trouvée');
      }

      timesheet.status = validateTimesheetDto.status;
      //@ts-ignore
      timesheet.comment = validateTimesheetDto.comment;

      await this.timesheetRepository.save(timesheet);
      if (validateTimesheetDto.status === TimesheetStatusEnum.APPROVED) {
        await this.mailService.sendTimesheetValidationEmail(
          timesheet.employee.email,
          timesheet.employee.name,
          timesheet.date,
        );
      }

      if (validateTimesheetDto.status === TimesheetStatusEnum.REJECTED) {
        await this.mailService.sendTimesheetRejectionEmail(
          timesheet.employee.email,
          timesheet.employee.name,
          timesheet.date,
          timesheet.comment,
        );
      }

      return timesheet;
  }

  // async update(id: number, validateTimesheetDto: ValidateTimesheetDto) {
  //   const sheet = await this.timesheetRepository.findOneBy({ id });
  //   if (!sheet) throw new NotFoundException();
  //   // @ts-ignore
  //   sheet.status = validateTimesheetDto.status;
  //   return await this.timesheetRepository.save(sheet);
  // }

  async exportAllToExcel() {
    const data = await this.findAllTimesheets();
    // @ts-ignore
    const worksheet = XLSX.utils.json_to_sheet(data);
    // @ts-ignore
    const workbook = XLSX.utils.book_new();
    // @ts-ignore
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feuilles");

    // @ts-ignore
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }

  async remove(id: number) : Promise<void> {
    const timesheet = await this.findOneTimesheet(id);
    await this.timesheetRepository.remove(timesheet);
  }
}
