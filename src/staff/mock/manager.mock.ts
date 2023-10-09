import { StaffMember } from "../entities/staff.entity";
import { roles } from "../enums/roles.enum";

export const mockManager: StaffMember = {
    id: 1,
    name: 'Main Guy',
    salary: 500,
    joinDate: new Date(2016, 10, 1),
    role: roles.MANAGER,
    supervisorId: null
}