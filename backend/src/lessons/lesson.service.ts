import {Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {LessonRepository} from "./lesson.repository";
import {CreateClassroomDto} from "../classrooms/dto/create-classroom";
import {Manager} from "../auth/manager/manager.entity";
import {Classroom} from "../classrooms/classroom.entity";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {Lesson} from "./lesson.entity";
import {UpdateLessonDto} from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
    private logger = new Logger('LessonService', true);

    constructor(
        @InjectRepository(LessonRepository)
        private lessonRepository: LessonRepository
    ) {
    }

    async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
        return this.lessonRepository.createLesson(createLessonDto)
    }

    async updateLesson(updateLessonDto: UpdateLessonDto): Promise<void> {
        await this.lessonRepository.update(updateLessonDto.id, updateLessonDto)
    }

    async getLessons(): Promise<Lesson[]> {
        return this.lessonRepository.find()
    }

    async getLessonsCount(): Promise<number> {
        this.logger.debug('Fetching the count of lessons');

        try {
            const result = await this.lessonRepository.query(`
                SELECT 
                    count(*)
                FROM 
                    lesson
            `);

            const count = parseInt(result[0].count, 10);
            this.logger.debug(`Count of lessons retrieved: ${count}`);
            return count; // Return the count
        } catch (error) {
            this.logger.error('Failed to fetch the count of lessons', error.stack);
            throw new InternalServerErrorException('Failed to fetch the count of lessons'); // Throw an exception
        }
    }

    async deleteLessons(ids: string[]): Promise<void> {
        try {
            for (let i = 0; i<ids.length; i++) {
                // Delete lesson
                const result = await this.lessonRepository.query(`
                    DELETE FROM lesson WHERE id = $1
                `, [ids[i]]);
            }
        } catch (error) {
            console.log(error)
        }
    }
}