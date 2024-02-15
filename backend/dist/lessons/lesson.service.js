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
exports.LessonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lesson_repository_1 = require("./lesson.repository");
let LessonService = class LessonService {
    constructor(lessonRepository) {
        this.lessonRepository = lessonRepository;
        this.logger = new common_1.Logger('LessonService', true);
    }
    async createLesson(createLessonDto) {
        return this.lessonRepository.createLesson(createLessonDto);
    }
    async updateLesson(updateLessonDto) {
        await this.lessonRepository.update(updateLessonDto.id, updateLessonDto);
    }
    async getLessons() {
        return this.lessonRepository.find();
    }
    async getLessonsCount() {
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
            return count;
        }
        catch (error) {
            this.logger.error('Failed to fetch the count of lessons', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch the count of lessons');
        }
    }
    async deleteLessons(ids) {
        try {
            for (let i = 0; i < ids.length; i++) {
                const result = await this.lessonRepository.query(`
                    DELETE FROM lesson WHERE id = $1
                `, [ids[i]]);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
LessonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lesson_repository_1.LessonRepository)),
    __metadata("design:paramtypes", [lesson_repository_1.LessonRepository])
], LessonService);
exports.LessonService = LessonService;
//# sourceMappingURL=lesson.service.js.map