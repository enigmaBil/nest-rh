import { TimesheetStatusEnum } from "src/common/timesheet-status.enum";

export class ResponseTimesheetDto {
    uuid: string;
    date: Date;
    startTime: string;
    endTime: string;
    totalHours: number;
    description?: string;
    status: TimesheetStatusEnum;
    employeeId: string;
    createdAt: Date;
    updatedAt: Date;
}