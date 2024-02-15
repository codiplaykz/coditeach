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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const signin_credentials_dto_1 = require("./dto/signin-credentials.dto");
const student_sign_in_credentials_dto_1 = require("./dto/student-sign-in-credentials.dto");
const update_manager_dto_1 = require("./manager/dto/update-manager.dto");
const update_student_dto_1 = require("./student/dto/update-student.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    managerSignIn(signInCredentialsDto) {
        return this.authService.managerSignIn(signInCredentialsDto);
    }
    studentSignIn(studentSignInCredentialsDto) {
        return this.authService.studentSignIn(studentSignInCredentialsDto);
    }
    changeManagerPass(updateManagerDto) {
        return this.authService.changeManagerPassword(updateManagerDto);
    }
    changeStudentPass(updateStudentDto) {
        return this.authService.changeStudentPassword(updateStudentDto);
    }
};
__decorate([
    (0, common_1.Post)('/manager/sign_in'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_credentials_dto_1.SignInCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "managerSignIn", null);
__decorate([
    (0, common_1.Post)('/student/sign_in'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_sign_in_credentials_dto_1.StudentSignInCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "studentSignIn", null);
__decorate([
    (0, common_1.Put)('/manager/change_pass'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_manager_dto_1.UpdateManagerDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changeManagerPass", null);
__decorate([
    (0, common_1.Put)('/student/change_pass'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changeStudentPass", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map