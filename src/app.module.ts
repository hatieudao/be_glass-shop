import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './utils/logger.middleware';
import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from './constant';
import configuration from './config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: configuration,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(MYSQL_HOST),
        port: +configService.get(MYSQL_PORT),
        username: configService.get(MYSQL_USER),
        password: configService.get(MYSQL_PASSWORD),
        database: configService.get(MYSQL_DATABASE),
        entities: [__dirname + '/**/*.schema{.ts,.js}'],
        synchronize: false,
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
