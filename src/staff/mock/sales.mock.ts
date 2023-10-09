import { StaffMember } from "../entities/staff.entity";
import { roles } from "../enums/roles.enum";

export const mockSales: StaffMember = {
    id: 2,
    name: 'Sales Guy',
    salary: 500,
    joinDate: new Date(2019, 10, 1),
    role: roles.SALES,
    supervisorId: 1
}