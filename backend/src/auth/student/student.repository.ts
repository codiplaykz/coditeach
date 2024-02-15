import {EntityRepository, Repository} from "typeorm";
import {Student} from "./student.entity";
import {CreateStudentDto} from "./dto/create-student.dto";
import * as bcrypt from 'bcrypt';
import {ConflictException, InternalServerErrorException, Logger} from "@nestjs/common";
import {Manager} from "../manager/manager.entity";
import {UpdateStudentDto} from "./dto/update-student.dto";

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {
    private logger = new Logger('TasksRepository', true);

    async createStudent(createStudentDto: CreateStudentDto) {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(createStudentDto.password, salt)

        const student = this.create({
            name: createStudentDto.name,
            password: hashedPassword,
            classroomId: createStudentDto.classroomId,
            accountId: createStudentDto.accountId,
        })

        try {
            return await this.save(student)
        } catch (error) {
            if (error.code === '23505') { //duplicate email
                throw new ConflictException('Account with current ID already exists')
            }
            if (error.code === '22P02') { //classroom id incorrect
                throw new ConflictException('Classroom id incorrect')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }

    async createStudents(students: CreateStudentDto[]) {
        const studentEntities = []
        for (let i=0; i<students.length; i++) {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(students[i].password, salt)

            const studentEntity = this.create({
                name: students[i].name,
                password: hashedPassword,
                classroomId: students[i].classroomId,
                accountId: students[i].accountId,
            })
            studentEntities.push(studentEntity)
        }

        try {
            return await this.save(studentEntities)
        } catch (error) {
            if (error.code === '23505') { //duplicate email
                throw new ConflictException('Account with current ID already exists')
            }
            if (error.code === '22P02') { //classroom id incorrect
                throw new ConflictException('Classroom id incorrect')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }

    async getStudents(manager: Manager) {
        try {
            return await this.query('select s.id, s.name, s."accountId", s."classroomId", s.profile_image, c.id as c_id, c.title, c.code, c."createdAt", c."managerId" from student as s inner join classroom as c on s."classroomId" = c.id where (select "schoolId" from manager where id=c."managerId")=$1', [manager.schoolId])
        } catch (error) {
            console.log(error)
        }
    }

    async getAllStudents() {
        try {
            return await this.query('select s.id, s.name, s."accountId", s."classroomId", s.profile_image, c.id as "classroomId", sc.id as "schoolId", sc.name as "schoolName" from student as s inner join classroom as c on s."classroomId" = c.id inner join manager as m on c."managerId"=m.id inner join school as sc on m."schoolId"=sc.id')
        } catch (error) {
            console.log(error)
        }
    }


    async updateStudent(updateStudentDto: UpdateStudentDto) {
        try {
            if (updateStudentDto.password) {
                const salt = await bcrypt.genSalt()
                updateStudentDto.password = await bcrypt.hash(updateStudentDto.password, salt)
            }
            await this.update(updateStudentDto.id, updateStudentDto)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}