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
exports.ClassroomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const classroom_repository_1 = require("./classroom.repository");
let ClassroomService = class ClassroomService {
    constructor(classroomRepository) {
        this.classroomRepository = classroomRepository;
        this.logger = new common_1.Logger('ClassroomService', true);
    }
    getClassrooms(manager) {
        return this.classroomRepository.getClassrooms(manager);
    }
    createClassroom(createClassroomDto, manager) {
        return this.classroomRepository.createClassroom(createClassroomDto, manager);
    }
    deleteClassroom(classroomCode) {
        return this.classroomRepository.deleteClassroom(classroomCode);
    }
    async getClassroomsCount(manager) {
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
            };
        }
        else {
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
                };
            }
            catch (error) {
                this.logger.error('Failed to fetch the count of classrooms', error.stack);
                throw new common_1.InternalServerErrorException('Failed to fetch the count of classrooms');
            }
        }
    }
    async checkClassroomCode(classroomCode) {
        const classroom = await this.classroomRepository.findOne({
            code: classroomCode
        });
        if (classroom) {
            return classroom;
        }
        else {
            throw new common_1.NotFoundException();
        }
    }
};
ClassroomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(classroom_repository_1.ClassroomRepository)),
    __metadata("design:paramtypes", [classroom_repository_1.ClassroomRepository])
], ClassroomService);
exports.ClassroomService = ClassroomService;
//# sourceMappingURL=classroom.service.js.map