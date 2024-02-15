import {EntityRepository, Repository} from "typeorm";
import {Classroom} from "./classroom.entity";
import {CreateClassroomDto} from "./dto/create-classroom";
import {InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {Manager} from "../auth/manager/manager.entity";
import {ManagerRole} from "../auth/manager/role-status.enum";

@EntityRepository(Classroom)
export class ClassroomRepository extends Repository<Classroom> {
    private logger = new Logger('SchoolController');

    generateClassCode(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            code += chars[randomIndex];
        }

        return code;
    }

    async getClassrooms(manager: Manager) {
        let classrooms = []
        if (manager.role === ManagerRole.SCHOOL_ADMIN) {
            classrooms = await this.query('select c.id, c.title, c.code, c."managerId", c."createdAt", s.id as student_id, s.name, s."accountId", s."profile_image" from classroom as c left join student as s on c.id = s."classroomId" where (select "schoolId" from manager where id=c."managerId")=$1', [manager.schoolId])
        } else {
            classrooms = await this.query('select c.id, c.title, c.code, c."managerId", c."createdAt", s.id as student_id, s.name, s."accountId", s."profile_image" from classroom as c left join student as s on c.id = s."classroomId" where c."managerId"=$1', [manager.id])
        }

        const grouped = classrooms.reduce((acc, curr) => {
            // Find the classroom in the accumulator array
            const classroomIndex = acc.findIndex(item => item.id === curr.id);

            // If the classroom doesn't exist in the accumulator, initialize it
            if (classroomIndex === -1) {
                const newClassroom = {
                    id: curr.id,
                    title: curr.title,
                    code: curr.code,
                    managerId: curr.managerId,
                    createdAt: curr.createdAt,
                    students: []
                };

                if (curr.student_id) {
                    newClassroom.students.push({
                        id: curr.student_id,
                        name: curr.name,
                        accountId: curr.accountId,
                        profile_image: curr.profile_image
                    });
                }

                acc.push(newClassroom);
            } else {
                // If there's a student associated with the classroom, add it to the students array
                if (curr.student_id) {
                    acc[classroomIndex].students.push({
                        id: curr.student_id,
                        name: curr.name,
                        accountId: curr.accountId,
                        profile_image: curr.profile_image
                    });
                }
            }

            return acc;
        }, []);
        return grouped
    }

    async createClassroom(createClassroomDto: CreateClassroomDto, manager: Manager): Promise<Classroom> {
        const { title  } = createClassroomDto;
        let check = true
        let code = this.generateClassCode()

        // WHILE CODE IS UNIQUE
        while (check) {
            //CHECK IF CODE ALREADY USED
            const classroom = await this.findOne({
                code: code
            })

            code = this.generateClassCode()

            if (!classroom) {
                check = false
            }
        }
        let newClassroom: Classroom | PromiseLike<Classroom>

        if (createClassroomDto.managerId) {
            newClassroom = this.create({
                title,
                code,
                managerId: createClassroomDto.managerId,
                createdAt: new Date()
            })
        } else {
            newClassroom = this.create({
                title,
                code,
                managerId: manager.id,
                createdAt: new Date()
            })
        }

        try {
            await this.save(newClassroom);
        } catch (error) {
            throw new InternalServerErrorException()
        }
        return newClassroom;
    }

    async deleteClassroom(classroomCode: string) {
        // Delete all students associated with this classroom code
        try {
            const classroom = await this.query('SELECT id FROM classroom WHERE code=$1', [classroomCode])

            if (classroom.length === 0) {
                this.logger.warn(`Classroom with code "${classroomCode}" not exists`)
                throw new NotFoundException([`Classroom with code ${classroomCode} not exists`])
            } else {
                const { id } = classroom[0]
                await this.query('delete from student where "classroomId" = $1', [id])
                await this.query('delete from classroom where "code" = $1', [classroomCode])
            }
        }
        catch (error) {
            throw error
        }
    }
}