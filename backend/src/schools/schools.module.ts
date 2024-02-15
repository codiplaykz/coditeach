import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SchoolsController} from "./schools.controller";
import {SchoolsService} from "./schools.service";
import {SchoolsRepository} from "./schools.repository";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([SchoolsRepository]), AuthModule],
    controllers: [SchoolsController],
    providers: [SchoolsService]
})
export class SchoolsModule {}
