import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { roles } from './enums/roles.enum';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('create-manager')
  createManager(@Body() createStaff: CreateStaffDto) {
    createStaff.role = roles.MANAGER;
    return this.staffService.create(createStaff);
  }

  @Post('create-sales')
  createSales(@Body() createStaff: CreateStaffDto) {
    createStaff.role = roles.SALES;
    return this.staffService.create(createStaff);
  }

  @Post('create-employee')
  createEmployee(@Body() createStaff: CreateStaffDto) {
    createStaff.role = roles.EMPLOYEE;
    return this.staffService.create(createStaff);
  }

  @Get('all')
  findAll() {
    return this.staffService.findAll();
  }

  @Get('/member/:id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @Patch('edit-member/:id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete('delete-member/:id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }

  @Post('add-subordinate/:id/:subId')
  addSubordinate(@Param('id') id:number, @Param('subId') sub: number) {
    return this.staffService.assignSubordinate(id, sub);
  }

  @Post('count-salary/:id')
  countSalary(@Param('id') id:number) {
    return this.staffService.calculateSalary(id);
  }
}
