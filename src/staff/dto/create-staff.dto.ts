import { IsNumber, IsString } from "class-validator";

export class CreateStaffDto {

    id: number;

    @IsString()
    name: string;

    @IsNumber()
    salary: number;

    @IsString()
    role: string

    @IsNumber()
    supervisorId: number;
}
