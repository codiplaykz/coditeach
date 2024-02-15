import { LessonRepository } from "./lesson.repository";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { Lesson } from "./lesson.entity";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
export declare class LessonService {
    private lessonRepository;
    private logger;
    constructor(lessonRepository: LessonRepository);
    createLesson(createLessonDto: CreateLessonDto): Promise<Lesson>;
    updateLesson(updateLessonDto: UpdateLessonDto): Promise<void>;
    getLessons(): Promise<Lesson[]>;
    getLessonsCount(): Promise<number>;
    deleteLessons(ids: string[]): Promise<void>;
}
