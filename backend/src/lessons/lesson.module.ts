import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {LessonRepository} from "./lesson.repository";
import {LessonController} from "./lesson.controller";
import {LessonService} from "./lesson.service";

@Module({
    imports: [TypeOrmModule.forFeature([LessonRepository]), AuthModule],
    controllers: [LessonController],
    providers: [LessonService]
})
export class LessonModule {}
