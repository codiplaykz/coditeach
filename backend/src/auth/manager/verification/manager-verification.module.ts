import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ManagerVerificationRepository} from "./manager-verification.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([ManagerVerificationRepository])
    ],
})
export class ManagerVerificationModule {}
