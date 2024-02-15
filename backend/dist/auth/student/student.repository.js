"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
let StudentRepository = class StudentRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('TasksRepository', true);
    }
    async createStudent(createStudentDto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createStudentDto.password, salt);
        const student = this.create({
            name: createStudentDto.name,
            password: hashedPassword,
            classroomId: createStudentDto.classroomId,
            accountId: createStudentDto.accountId,
        });
        try {
            return await this.save(student);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Account with current ID already exists');
            }
            if (error.code === '22P02') {
                throw new common_1.ConflictException('Classroom id incorrect');
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async createStudents(students) {
        const studentEntities = [];
        for (let i = 0; i < students.length; i++) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(students[i].password, salt);
            const studentEntity = this.create({
                name: students[i].name,
                password: hashedPassword,
                classroomId: students[i].classroomId,
                accountId: students[i].accountId,
            });
            studentEntities.push(studentEntity);
        }
        try {
            return await this.save(studentEntities);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Account with current ID already exists');
            }
            if (error.code === '22P02') {
                throw new common_1.ConflictException('Classroom id incorrect');
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async getStudents(manager) {
        try {
            return await this.query('select s.id, s.name, s."accountId", s."classroomId", s.profile_image, c.id as c_id, c.title, c.code, c."createdAt", c."managerId" from student as s inner join classroom as c on s."classroomId" = c.id where (select "schoolId" from manager where id=c."managerId")=$1', [manager.schoolId]);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllStudents() {
        try {
            return await this.query('select s.id, s.name, s."accountId", s."classroomId", s.profile_image, c.id as "classroomId", sc.id as "schoolId", sc.name as "schoolName" from student as s inner join classroom as c on s."classroomId" = c.id inner join manager as m on c."managerId"=m.id inner join school as sc on m."schoolId"=sc.id');
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateStudent(updateStudentDto) {
        try {
            if (updateStudentDto.password) {
                const salt = await bcrypt.genSalt();
                updateStudentDto.password = await bcrypt.hash(updateStudentDto.password, salt);
            }
            await this.update(updateStudentDto.id, updateStudentDto);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
StudentRepository = __decorate([
    (0, typeorm_1.EntityRepository)(student_entity_1.Student)
], StudentRepository);
exports.StudentRepository = StudentRepository;
//# sourceMappingURL=student.repository.js.map