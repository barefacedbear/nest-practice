import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Reports } from './reports/reports.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql', host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'), username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'), database: config.get<string>('DB_NAME'),
          synchronize: config.get<boolean>('DB_SYNC'), entities: [User, Reports]
        }
      }
    }),
  //   TypeOrmModule.forRoot({
  //   type: 'mysql', host: 'localhost', port: 3306,
  //   username: 'root', password: 'root', database: 'test',
  //   entities: [User, Reports], synchronize: true
  // }),
  UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
