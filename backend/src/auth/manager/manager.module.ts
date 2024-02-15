import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ManagerController} from "./manager.controller";
import {ManagerRepository} from "./manager.repository";
import {ManagerService} from "./manager.service";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {AuthModule} from "../auth.module";
import {ManagerVerificationModule} from "./verification/manager-verification.module";
import {ManagerVerificationRepository} from "./verification/manager-verification.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([ManagerRepository, ManagerVerificationRepository]), AuthModule
    ],
    providers: [ManagerService],
    controllers: [ManagerController],
})
export class ManagerModule {}
