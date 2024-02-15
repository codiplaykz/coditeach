import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
export declare class LessonController {
    private lessonService;
    constructor(lessonService: LessonService);
    getAllLessonsCount(): Promise<number>;
    createLesson(createLessonDto: CreateLessonDto): Promise<import("./lesson.entity").Lesson>;
    updateLesson(updateLessonDto: UpdateLessonDto): Promise<void>;
    getLessons(): Promise<import("./lesson.entity").Lesson[]>;
    deleteLessons(ids: string[]): Promise<void>;
}
