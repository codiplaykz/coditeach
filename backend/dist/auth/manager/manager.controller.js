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
exports.ManagerController = void 0;
const common_1 = require("@nestjs/common");
const manager_service_1 = require("./manager.service");
const create_manager_dto_1 = require("./dto/create-manager.dto");
const send_invite_dto_1 = require("./dto/send-invite.dto");
const get_teachers_filter_dto_1 = require("./dto/get-teachers-filter.dto");
const get_user_decorator_1 = require("../get-user.decorator");
const manager_entity_1 = require("./manager.entity");
const passport_1 = require("@nestjs/passport");
const complete_verification_dto_1 = require("./dto/complete-verification.dto");
let ManagerController = class ManagerController {
    constructor(managerService) {
        this.managerService = managerService;
    }
    getAllManagerCounts() {
        return this.managerService.getManagersCount();
    }
    async deleteManagers(ids) {
        return this.managerService.deleteManagers(ids);
    }
    async deleteManagerVerifications(ids) {
        return this.managerService.deleteManagerVerifications(ids);
    }
    async createManager(createManagerDto) {
        const defaultPassword = 'Test2341!';
        if (!createManagerDto.password) {
            createManagerDto.password = defaultPassword;
        }
        return this.managerService.createManager(createManagerDto, true);
    }
    async sendInvite(sendInviteDto) {
        return this.managerService.sendInvite(sendInviteDto);
    }
    async getTeachers(filterDto, manager) {
        return this.managerService.getTeachers(filterDto, manager);
    }
    async getAllManagers() {
        return this.managerService.getAllManagers();
    }
    async getManagerVerifications() {
        return this.managerService.getManagerVerifications();
    }
    async checkVerificationCode(verificationCode) {
        return this.managerService.checkVerification(verificationCode);
    }
    async completeVerification(completeVerificationDto) {
        return this.managerService.completeVerification(completeVerificationDto);
    }
};
__decorate([
    (0, common_1.Get)('/count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManagerController.prototype, "getAllManagerCounts", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "deleteManagers", null);
__decorate([
    (0, common_1.Delete)('/verifications/delete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "deleteManagerVerifications", null);
__decorate([
    (0, common_1.Post)('/create'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_manager_dto_1.CreateManagerDto]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "createManager", null);
__decorate([
    (0, common_1.Post)('/invite'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_invite_dto_1.SendInviteDto]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "sendInvite", null);
__decorate([
    (0, common_1.Get)('/get'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decorator_1.GetManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_teachers_filter_dto_1.GetTeachersFilterDto,
        manager_entity_1.Manager]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "getTeachers", null);
__decorate([
    (0, common_1.Get)('/get_all'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "getAllManagers", null);
__decorate([
    (0, common_1.Get)('/verification/get'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "getManagerVerifications", null);
__decorate([
    (0, common_1.Get)('/check/:verificationCode'),
    __param(0, (0, common_1.Param)('verificationCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "checkVerificationCode", null);
__decorate([
    (0, common_1.Post)('/complete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [complete_verification_dto_1.CompleteVerificationDto]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "completeVerification", null);
ManagerController = __decorate([
    (0, common_1.Controller)('manager'),
    __metadata("design:paramtypes", [manager_service_1.ManagerService])
], ManagerController);
exports.ManagerController = ManagerController;
//# sourceMappingURL=manager.controller.js.map