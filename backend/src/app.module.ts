import {Module} from '@nestjs/common';
import {ClassroomModule} from './classrooms/classroom.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolsModule} from "./schools/schools.module";
import {AuthModule} from './auth/auth.module';
import {ManagerModule} from "./auth/manager/manager.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {ManagerVerificationModule} from "./auth/manager/verification/manager-verification.module";
import {StudentModule} from "./auth/student/student.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { join } from 'path'
import {LessonModule} from "./lessons/lesson.module";
@Module({
  imports: [
      ConfigModule.forRoot({
            envFilePath: [`.env.stage.${process.env.STAGE}`],
      }),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
              return {
                  host: configService.get('DB_HOST'),
                  port: configService.get('DB_PORT'),
                  username: configService.get('DB_USERNAME'),
                  password: configService.get('DB_PASSWORD'),
                  database: configService.get('DB_DATABASE'),
                  type: 'postgres',
                  ssl: true,
                  extra: {
                      ssl: {
                          rejectUnauthorized: false,
                      },
                  },
                  synchronize: true,
                  autoLoadEntities: true,
              }
          },
      }),
      MailerModule.forRoot({
        transport: 'smtps://azamattolegenov1@gmail.com:owmuoqunujiitaos@smtp.gmail.com',
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>'
        },
        template: {
          dir: join(__dirname, '..', '/src/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      })
    , AuthModule, ManagerModule, ClassroomModule, SchoolsModule, ManagerVerificationModule, StudentModule, LessonModule],
})
export class AppModule {}
