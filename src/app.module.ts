import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GetController } from './app.controller.get';
import { FindService } from './app.service.find';
import { Query } from './helpers/Query';
import { Logger } from './helpers/Logger';
import { Schema } from './helpers/Schema';
import { Authentication } from './helpers/Authentication'; 
import auth from './config/auth.config'; 
import database from './config/database.config';
import hosts from './config/hosts.config';
import restrictions from './config/restrictions.config';
import { MySQL } from './databases/mysql.database';
import { Pagination } from './helpers/Pagination';
import { Sort } from './helpers/Sort';
import { HostCheckMiddleware } from './middleware/HostCheck';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [auth, database, hosts, restrictions],
    }),
  ],
  controllers: [GetController],
  providers: [FindService, Authentication, Query, Schema, Pagination, Logger, Sort, MySQL],
  exports: [FindService, Authentication, Query, Schema, Pagination, Logger, Sort, MySQL],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HostCheckMiddleware)
      .forRoutes('*');
  }
}