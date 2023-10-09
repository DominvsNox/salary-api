import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from "typeorm";
import { roles } from "../enums/roles.enum";
import { ApiProperty } from "@nestjs/swagger";

  @Entity()
  export class StaffMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({default: 500})
    salary: number;

    @CreateDateColumn()
    joinDate: Date;

    @Column({default: roles.EMPLOYEE})
    role: string;

    @ApiProperty()
    @Column({nullable: true})
    supervisorId: number;
  }