import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffMember } from './entities/staff.entity';
import { roles } from './enums/roles.enum';

@Injectable()
export class StaffService {

  constructor(
    @InjectRepository(StaffMember)
    private readonly StaffRepository: Repository<StaffMember>,
  ) {}

  create(staffMember: CreateStaffDto) {
    return this.StaffRepository.save(staffMember);
  }

  findAll() {
    return this.StaffRepository.find();
  }

  findOne(id: number) {
    return this.StaffRepository.findOneBy({id});
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return this.StaffRepository.update(id, updateStaffDto);
  }

  remove(id: number) {
    return this.StaffRepository.delete(id);
  }

  private baseSalary: number = 500;

  async assignSubordinate(id: number, subId: number) {

    const assignTo = await this.findOne(id);
    if (!assignTo) {
      return 'Wrong supervisor!';
    }

    const assignee = await this.findOne(subId);
    if (!assignee) {
      return 'Wrong subordinate!';
    }

    if(assignTo.role != roles.EMPLOYEE) {
      assignee.supervisorId = assignTo.id;
      this.update(subId, assignee);
      return 'Subordinate subscribed to supervisor!';
    } else {
      return 'Employee can`t be supervisors!';
    }

  }

  async calculateYearsInCompany(joinDate: Date) {
    let now = new Date();
    return now.getFullYear() - joinDate.getFullYear();
  }

  getAllSubordinates(id: number) {
    return this.StaffRepository.findBy({supervisorId: id});
  }

  async loopThroughSubordinates(id: number) {
    let subs = await this.getAllSubordinates(id);
    let deltaSubs = 0;
    if (subs.length != 0) {
      subs.forEach((s) => {
        deltaSubs += s.salary * 0.003;
        if (s.supervisorId) {
          this.loopThroughSubordinates(s.id);
        }
      });
    }
    return deltaSubs;
  }

  async calculateSalaryForEmployee(theGuy: StaffMember) {
    let maxSalary = this.baseSalary + (this.baseSalary * 0.3);
    let deltaSalary = theGuy.salary * 0.03;
    let years = await this.calculateYearsInCompany(theGuy.joinDate);
    let newSalary = theGuy.salary + (deltaSalary * years);
    if(newSalary < maxSalary) {
      theGuy.salary = newSalary;
      this.update(theGuy.id, theGuy);
      return `Salary changed successfully to ${theGuy.salary}`;
    } else {
      theGuy.salary = maxSalary;
      this.update(theGuy.id, theGuy);
      return 'Salary is at maximum!'
    }
  }

  async calculateSalaryForSales(theGuy: StaffMember) {
    let baseSalary = this.baseSalary;
    let years = await this.calculateYearsInCompany(theGuy.joinDate);
    let maxSalary = baseSalary + (baseSalary * 0.35);
    let deltaSalary = baseSalary * 0.01;
    let newSalary = theGuy.salary + (deltaSalary * years);
    if(newSalary < maxSalary) {
      theGuy.salary = newSalary;
      let subs = await this.loopThroughSubordinates(theGuy.id);
      if(subs != 0) {
        theGuy.salary += subs;
      }
      this.update(theGuy.id, theGuy);
      return `Salary changed successfully to ${theGuy.salary}`;
    } else {
        theGuy.salary = maxSalary;
        this.update(theGuy.id, theGuy);
        return 'Salary is at maximum!';
    }
  }

  async calculateSalaryForManager(theGuy: StaffMember) {
    let baseSalary = this.baseSalary;
    let years = await this.calculateYearsInCompany(theGuy.joinDate);
    let maxSalary = baseSalary + (baseSalary * 0.4);
    let deltaSalary = baseSalary * 0.05;
    let newSalary = theGuy.salary + (deltaSalary * years);
    if(newSalary < maxSalary) {
      theGuy.salary = newSalary;
      let subs = await this.getAllSubordinates(theGuy.id);
      if(subs.length != 0) {
        let subSalary = subs.length * (baseSalary * 0.005);
        theGuy.salary += subSalary;
      }
      this.update(theGuy.id, theGuy);
      return `Salary changed successfully to ${theGuy.salary}`;
    } else {
        theGuy.salary = maxSalary;
        this.update(theGuy.id, theGuy);
        return 'Salary is at maximum!';
    }
  }

  async calculateSalary(id: number) {

    const theGuy = await this.findOne(id);
    switch(theGuy.role) {
      case roles.EMPLOYEE: {
        this.calculateSalaryForEmployee(theGuy);
      }
      case roles.SALES: {
        this.calculateSalaryForSales(theGuy);
      }
      case roles.MANAGER: {
        this.calculateSalaryForManager(theGuy);
      }
    }
  }
}

