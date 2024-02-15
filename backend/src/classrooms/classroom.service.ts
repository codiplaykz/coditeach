import {Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {Classroom} from "./classroom.entity";
import {CreateClassroomDto} from "./dto/create-classroom";
import {InjectRepository} from "@nestjs/typeorm";
import {ClassroomRepository} from "./classroom.repository";
import {Manager} from "../auth/manager/manager.entity";

@Injectable()
export class ClassroomService {
    private logger = new Logger('ClassroomService', true);

    constructor(
        @InjectRepository(ClassroomRepository)
        private classroomRepository: ClassroomRepository
    ) {}

    getClassrooms(manager: Manager) {
        return this.classroomRepository.getClassrooms(manager)
    }

    createClassroom(createClassroomDto: CreateClassroomDto, manager: Manager): Promise<Classroom> {
        return this.classroomRepository.createClassroom(createClassroomDto, manager)
    }

    deleteClassroom(classroomCode: string): Promise<void> {
        return this.classroomRepository.deleteClassroom(classroomCode)
    }

    async getClassroomsCount(manager?: Manager): Promise<{classroom_count: number, students_count: number}> {
        this.logger.debug('Fetching the count of classrooms');

        if (manager.role === 'TEACHER') {
            const classroomIds = manager.classrooms.map((_, index) => `$${index + 1}`).join(', ');

            const result = await this.classroomRepository.query(`
                            SELECT 
                                count(*)
                            FROM 
                                student
                            WHERE "classroomId" IN (${classroomIds})
                        `, [...manager.classrooms.map((item) => item.id)]);

            const studentsCount = parseInt(result[0].count, 10);
            this.logger.debug(`Count of students retrieved: ${studentsCount}`);
            return {
                classroom_count: manager.classrooms.length,
                students_count: studentsCount
            } // Return the count
        } else {
            try {
                const result = await this.classroomRepository.query(`
                SELECT 
                    count(*)
                FROM 
                    classroom
            `);

                const count = parseInt(result[0].count, 10);
                this.logger.debug(`Count of classrooms retrieved: ${count}`);
                return {
                    classroom_count: count,
                    students_count: 0
                } // Return the count
            } catch (error) {
                this.logger.error('Failed to fetch the count of classrooms', error.stack);
                throw new InternalServerErrorException('Failed to fetch the count of classrooms'); // Throw an exception
            }
        }
    }

    async checkClassroomCode(classroomCode: string): Promise<Classroom> {
        const classroom = await this.classroomRepository.findOne({
            code: classroomCode
        })
        if (classroom) {
            return classroom
        } else {
            throw new NotFoundException()
        }
    }
}