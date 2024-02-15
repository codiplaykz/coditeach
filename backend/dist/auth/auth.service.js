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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const manager_repository_1 = require("./manager/manager.repository");
const student_repository_1 = require("./student/student.repository");
let AuthService = class AuthService {
    constructor(managerRepository, studentRepository, jwtService) {
        this.managerRepository = managerRepository;
        this.studentRepository = studentRepository;
        this.jwtService = jwtService;
    }
    async changeManagerPassword(updateManagerDto) {
        const { id, password } = updateManagerDto;
        return this.managerRepository.updateManager({ id: id, password: password });
    }
    async changeStudentPassword(updateStudentDto) {
        const { id, password } = updateStudentDto;
        return this.studentRepository.updateStudent({ id: id, password: password });
    }
    async managerSignIn(signInCredentialsDto) {
        const { email, password } = signInCredentialsDto;
        let manager = await this.managerRepository.getManager(email);
        manager = manager[0];
        if (manager) {
            if (manager.isVerified || manager.role === 'SCHOOL_ADMIN') {
                if (manager && (await bcrypt.compare(password, manager.password))) {
                    const payload = { email };
                    const accessToken = this.jwtService.sign(payload);
                    const userData = {
                        id: manager.id,
                        schoolId: manager.schoolId,
                        name: manager.name,
                        email: manager.email,
                        role: manager.role,
                        profile_image: manager.profile_image,
                    };
                    return { isVerified: true, accessToken, userData };
                }
                else {
                    throw new common_1.UnauthorizedException(['Please check your login credentials']);
                }
            }
            else {
                throw new common_1.UnauthorizedException(['Your account is not verified']);
            }
        }
        else {
            throw new common_1.UnauthorizedException(['Please check your login credentials']);
        }
    }
    async studentSignIn(studentSignInCredentialsDto) {
        const { accountId, password } = studentSignInCredentialsDto;
        let student = await this.studentRepository.findOne({
            accountId: accountId
        });
        if (student) {
            if (student && (await bcrypt.compare(password, student.password))) {
                const payload = { email: accountId };
                const accessToken = this.jwtService.sign(payload);
                const userData = {
                    name: student.name,
                    accountId: student.accountId,
                    classroomId: student.classroomId,
                    email: student.accountId,
                    profile_image: student.profile_image,
                };
                return { isVerified: true, accessToken, userData };
            }
            else {
                throw new common_1.UnauthorizedException(['Invalid credentials']);
            }
        }
        else {
            throw new common_1.UnauthorizedException(['Please check your login credentials']);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_repository_1.ManagerRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(student_repository_1.StudentRepository)),
    __metadata("design:paramtypes", [manager_repository_1.ManagerRepository,
        student_repository_1.StudentRepository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map