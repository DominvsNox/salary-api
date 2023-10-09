import { StaffMember } from "../entities/staff.entity";
import { roles } from "../enums/roles.enum";

export const mockEmployee: StaffMember = {
    id: 1,
    name: 'Lil Guy',
    salary: 500,
    joinDate: new Date(2020, 10, 1),
    role: roles.EMPLOYEE,
    supervisorId: 2
}