import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth.module";
import {StudentRepository} from "./student.repository";
import {StudentService} from "./student.service";
import {StudentController} from "./student.controller";
import {ClassroomRepository} from "../../classrooms/classroom.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentRepository, ClassroomRepository]), AuthModule
    ],
    providers: [StudentService],
    controllers: [StudentController],
})
export class StudentModule {}
