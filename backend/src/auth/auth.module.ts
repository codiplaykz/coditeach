import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {ManagerRepository} from "./manager/manager.repository";
import {ManagerService} from "./manager/manager.service";
import {ManagerVerificationRepository} from "./manager/verification/manager-verification.repository";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {StudentRepository} from "./student/student.repository";

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' })

@Module({
    imports: [
      passportModule,
      JwtModule.registerAsync({
       imports: [ConfigModule],
       inject: [ConfigService],
       useFactory: async (configService: ConfigService) => ({
           secret: configService.get('JWT_SECRET'),
           signOptions: {
               expiresIn: 86400
           }
       })
      }),
      TypeOrmModule.forFeature([StudentRepository, ManagerRepository, ManagerVerificationRepository]), ConfigModule
    ],
    providers: [AuthService, ManagerService, JwtStrategy],
    controllers: [AuthController],
    exports: [JwtStrategy, passportModule]
})
export class AuthModule {}
