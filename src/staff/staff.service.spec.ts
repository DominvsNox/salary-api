import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { StaffMember } from './entities/staff.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockManager } from './mock/manager.mock';
import { mockSales } from './mock/sales.mock';
import { mockEmployee } from './mock/employee.mock';

describe('StaffService', () => {
  let service: StaffService;
  let repository: Repository<StaffMember>;

  const manager = mockManager;
  const sales = mockSales;
  const employee = mockEmployee;

  const mockStaffService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findBy: jest.fn(),
    getAllSubordinates: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffService,
        {
        provide: getRepositoryToken(StaffMember),
        useValue: mockStaffService,
      }],
    }).compile();

    service = module.get<StaffService>(StaffService);
    repository = module.get<Repository<StaffMember>>(getRepositoryToken(StaffMember));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('staff repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('checks that managers salary is counted correctly', async () => {

    const expectedResult = 'Salary changed successfully to 677.5';
    jest.spyOn(service, 'getAllSubordinates').mockResolvedValue([sales]);
    const result = await service.calculateSalaryForManager(manager);
    expect(result).toBe(expectedResult);

  });

  it('checks that sales member salary is counted correctly', async () => {

    const expectedResult = 'Salary changed successfully to 521';
    jest.spyOn(service, 'loopThroughSubordinates').mockResolvedValue(employee.id);
    const result = await service.calculateSalaryForSales(sales);
    expect(result).toBe(expectedResult);

  });

  it('checks that employee salary is counted correctly', async () => {

    const expectedResult = 'Salary changed successfully to 545';
    const result = await service.calculateSalaryForEmployee(employee);
    expect(result).toBe(expectedResult);

  });

  it('checks that employee salary is maxed', async () => {

    const expectedResult = 'Salary is at maximum!';
    employee.salary = employee.salary *2;
    const result = await service.calculateSalaryForEmployee(employee);
    expect(result).toBe(expectedResult);

  });

  it('checks that sales salary is maxed', async () => {

    const expectedResult = 'Salary is at maximum!';
    sales.salary = sales.salary *2;
    jest.spyOn(service, 'loopThroughSubordinates').mockResolvedValue(employee.id);
    const result = await service.calculateSalaryForSales(sales);
    expect(result).toBe(expectedResult);

  });

  it('checks that managers salary is maxed', async () => {

    const expectedResult = 'Salary is at maximum!';
    manager.salary = manager.salary *2;
    jest.spyOn(service, 'getAllSubordinates').mockResolvedValue([sales]);
    const result = await service.calculateSalaryForManager(manager);
    expect(result).toBe(expectedResult);

  });

  it('checks that employee is not allowed to have subordinates', async () => {

    const expectedResult = 'Employee can`t be supervisors!';
    jest.spyOn(service, 'findOne').mockResolvedValue(sales);
    jest.spyOn(service, 'findOne').mockResolvedValue(employee);
    const result = await service.assignSubordinate(employee.id, sales.id);
    expect(result).toBe(expectedResult);

  });

});
