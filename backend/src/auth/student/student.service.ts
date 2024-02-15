import {Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StudentRepository} from "./student.repository";
import {ClassroomRepository} from "../../classrooms/classroom.repository";
import {CreateStudentDto} from "./dto/create-student.dto";
import {Manager} from "../manager/manager.entity";

@Injectable()
export class StudentService {
    private readonly logger = new Logger("StudentService", true);

    constructor(@InjectRepository(StudentRepository)
                private studentRepository: StudentRepository,
                @InjectRepository(ClassroomRepository)
                private classroomRepository: ClassroomRepository,) {
    }

    async getStudentsCount(): Promise<number> {
        this.logger.debug('Fetching the count of all students');

        try {
            const result = await this.studentRepository.query(`
                SELECT COUNT(*) FROM student
            `);

            const count = parseInt(result[0].count, 10);
            this.logger.debug(`Count of students retrieved: ${count}`);
            return count; // Return the count
        } catch (error) {
            this.logger.error('Failed to fetch the count of students', error.stack);
            throw new InternalServerErrorException('Failed to fetch the count of students'); // Throw an exception
        }
    }

    async deleteStudents(ids: string[]): Promise<void> {
        try {
            for (let i = 0; i<ids.length; i++) {
                console.log(ids[i])
                // Delete the student
                const result = await this.studentRepository.query(`
                    DELETE FROM student WHERE id = $1
                `, [ids[i]]);

                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async createStudent(createStudentDto: CreateStudentDto) {
        return this.studentRepository.createStudent(createStudentDto)
    }

    async createStudents(students: CreateStudentDto[]) {
        return this.studentRepository.createStudents(students)
    }

    async getStudents(manager: Manager) {
        return this.studentRepository.getStudents(manager)
    }

    async getAllStudents() {
        return this.studentRepository.getAllStudents()
    }
}