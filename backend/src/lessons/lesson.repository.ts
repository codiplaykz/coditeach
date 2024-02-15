import {EntityRepository, Repository} from "typeorm";
import {Lesson} from "./lesson.entity";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {InternalServerErrorException} from "@nestjs/common";

@EntityRepository(Lesson)
export class LessonRepository extends Repository<Lesson> {
    async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson>{
        let newLesson = this.create(createLessonDto)

        try {
            await this.save(newLesson);
        } catch (error) {
            throw new InternalServerErrorException()
        }

        return newLesson
    }
}