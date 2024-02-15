"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const classroom_module_1 = require("./classrooms/classroom.module");
const typeorm_1 = require("@nestjs/typeorm");
const schools_module_1 = require("./schools/schools.module");
const auth_module_1 = require("./auth/auth.module");
const manager_module_1 = require("./auth/manager/manager.module");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const manager_verification_module_1 = require("./auth/manager/verification/manager-verification.module");
const student_module_1 = require("./auth/student/student.module");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const lesson_module_1 = require("./lessons/lesson.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: [`.env.stage.${process.env.STAGE}`],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
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
                    };
                },
            }),
            mailer_1.MailerModule.forRoot({
                transport: 'smtps://azamattolegenov1@gmail.com:owmuoqunujiitaos@smtp.gmail.com',
                defaults: {
                    from: '"nest-modules" <modules@nestjs.com>'
                },
                template: {
                    dir: (0, path_1.join)(__dirname, '..', '/src/templates'),
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            }),
            auth_module_1.AuthModule, manager_module_1.ManagerModule, classroom_module_1.ClassroomModule, schools_module_1.SchoolsModule, manager_verification_module_1.ManagerVerificationModule, student_module_1.StudentModule, lesson_module_1.LessonModule
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map