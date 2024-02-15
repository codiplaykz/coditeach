import {Module} from '@nestjs/common';
import {ClassroomService} from "./classroom.service";
import {ClassroomController} from "./classroom.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ClassroomRepository} from "./classroom.repository";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([ClassroomRepository]), AuthModule],
    controllers: [ClassroomController],
    providers: [ClassroomService]
})
export class ClassroomModule {}
