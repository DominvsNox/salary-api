import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'salary_db',
    entities: [join(process.cwd(), 'dist/**/*.entity.js')],
    synchronize: true,
  }),
    StaffModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
