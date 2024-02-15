import { Repository } from "typeorm";
import { Lesson } from "./lesson.entity";
import { CreateLessonDto } from "./dto/create-lesson.dto";
export declare class LessonRepository extends Repository<Lesson> {
    createLesson(createLessonDto: CreateLessonDto): Promise<Lesson>;
}
