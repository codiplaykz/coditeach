"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomRepository = void 0;
const typeorm_1 = require("typeorm");
const classroom_entity_1 = require("./classroom.entity");
const common_1 = require("@nestjs/common");
const role_status_enum_1 = require("../auth/manager/role-status.enum");
let ClassroomRepository = class ClassroomRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('SchoolController');
    }
    generateClassCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            code += chars[randomIndex];
        }
        return code;
    }
    async getClassrooms(manager) {
        let classrooms = [];
        if (manager.role === role_status_enum_1.ManagerRole.SCHOOL_ADMIN) {
            classrooms = await this.query('select c.id, c.title, c.code, c."managerId", c."createdAt", s.id as student_id, s.name, s."accountId", s."profile_image" from classroom as c left join student as s on c.id = s."classroomId" where (select "schoolId" from manager where id=c."managerId")=$1', [manager.schoolId]);
        }
        else {
            classrooms = await this.query('select c.id, c.title, c.code, c."managerId", c."createdAt", s.id as student_id, s.name, s."accountId", s."profile_image" from classroom as c left join student as s on c.id = s."classroomId" where c."managerId"=$1', [manager.id]);
        }
        const grouped = classrooms.reduce((acc, curr) => {
            const classroomIndex = acc.findIndex(item => item.id === curr.id);
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
            }
            else {
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
        return grouped;
    }
    async createClassroom(createClassroomDto, manager) {
        const { title } = createClassroomDto;
        let check = true;
        let code = this.generateClassCode();
        while (check) {
            const classroom = await this.findOne({
                code: code
            });
            code = this.generateClassCode();
            if (!classroom) {
                check = false;
            }
        }
        let newClassroom;
        if (createClassroomDto.managerId) {
            newClassroom = this.create({
                title,
                code,
                managerId: createClassroomDto.managerId,
                createdAt: new Date()
            });
        }
        else {
            newClassroom = this.create({
                title,
                code,
                managerId: manager.id,
                createdAt: new Date()
            });
        }
        try {
            await this.save(newClassroom);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
        return newClassroom;
    }
    async deleteClassroom(classroomCode) {
        try {
            const classroom = await this.query('SELECT id FROM classroom WHERE code=$1', [classroomCode]);
            if (classroom.length === 0) {
                this.logger.warn(`Classroom with code "${classroomCode}" not exists`);
                throw new common_1.NotFoundException([`Classroom with code ${classroomCode} not exists`]);
            }
            else {
                const { id } = classroom[0];
                await this.query('delete from student where "classroomId" = $1', [id]);
                await this.query('delete from classroom where "code" = $1', [classroomCode]);
            }
        }
        catch (error) {
            throw error;
        }
    }
};
ClassroomRepository = __decorate([
    (0, typeorm_1.EntityRepository)(classroom_entity_1.Classroom)
], ClassroomRepository);
exports.ClassroomRepository = ClassroomRepository;
//# sourceMappingURL=classroom.repository.js.map