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
exports.ClassroomController = void 0;
const common_1 = require("@nestjs/common");
const classroom_service_1 = require("./classroom.service");
const create_classroom_1 = require("./dto/create-classroom");
const manager_entity_1 = require("../auth/manager/manager.entity");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../auth/get-user.decorator");
let ClassroomController = class ClassroomController {
    constructor(classroomService) {
        this.classroomService = classroomService;
    }
    async getClassrooms(manager) {
        return this.classroomService.getClassrooms(manager);
    }
    getAllClassroomsCount(manager) {
        return this.classroomService.getClassroomsCount(manager);
    }
    async createClassroom(createClassroomDto, manager) {
        return this.classroomService.createClassroom(createClassroomDto, manager);
    }
    async deleteClassroom(classroomCode) {
        return this.classroomService.deleteClassroom(classroomCode);
    }
    async checkClassroomCode(classroomCode) {
        return this.classroomService.checkClassroomCode(classroomCode);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, get_user_decorator_1.GetManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manager_entity_1.Manager]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "getClassrooms", null);
__decorate([
    (0, common_1.Get)('/count'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, get_user_decorator_1.GetManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manager_entity_1.Manager]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "getAllClassroomsCount", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_classroom_1.CreateClassroomDto,
        manager_entity_1.Manager]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "createClassroom", null);
__decorate([
    (0, common_1.Delete)('/delete/:classroomCode'),
    __param(0, (0, common_1.Param)('classroomCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "deleteClassroom", null);
__decorate([
    (0, common_1.Get)('/check/:classroomCode'),
    __param(0, (0, common_1.Param)('classroomCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "checkClassroomCode", null);
ClassroomController = __decorate([
    (0, common_1.Controller)('classroom'),
    __metadata("design:paramtypes", [classroom_service_1.ClassroomService])
], ClassroomController);
exports.ClassroomController = ClassroomController;
//# sourceMappingURL=classroom.controller.js.map