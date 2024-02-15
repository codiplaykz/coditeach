"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const student_repository_1 = require("./student.repository");
const classroom_repository_1 = require("../../classrooms/classroom.repository");
let StudentService = class StudentService {
    constructor(studentRepository, classroomRepository) {
        this.studentRepository = studentRepository;
        this.classroomRepository = classroomRepository;
        this.logger = new common_1.Logger("StudentService", true);
    }
    async getStudentsCount() {
        this.logger.debug('Fetching the count of all students');
        try {
            const result = await this.studentRepository.query(`
                SELECT COUNT(*) FROM student
            `);
            const count = parseInt(result[0].count, 10);
            this.logger.debug(`Count of students retrieved: ${count}`);
            return count;
        }
        catch (error) {
            this.logger.error('Failed to fetch the count of students', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch the count of students');
        }
    }
    async deleteStudents(ids) {
        try {
            for (let i = 0; i < ids.length; i++) {
                console.log(ids[i]);
                const result = await this.studentRepository.query(`
                    DELETE FROM student WHERE id = $1
                `, [ids[i]]);
                console.log(result);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async createStudent(createStudentDto) {
        return this.studentRepository.createStudent(createStudentDto);
    }
    async createStudents(students) {
        return this.studentRepository.createStudents(students);
    }
    async getStudents(manager) {
        return this.studentRepository.getStudents(manager);
    }
    async getAllStudents() {
        return this.studentRepository.getAllStudents();
    }
};
StudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_repository_1.StudentRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(classroom_repository_1.ClassroomRepository)),
    __metadata("design:paramtypes", [student_repository_1.StudentRepository,
        classroom_repository_1.ClassroomRepository])
], StudentService);
exports.StudentService = StudentService;
//# sourceMappingURL=student.service.js.map