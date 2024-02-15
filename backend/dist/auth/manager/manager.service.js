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
exports.ManagerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const manager_repository_1 = require("./manager.repository");
const mailer_1 = require("@nestjs-modules/mailer");
const uuid_1 = require("uuid");
const role_status_enum_1 = require("./role-status.enum");
const manager_verification_repository_1 = require("./verification/manager-verification.repository");
let ManagerService = class ManagerService {
    constructor(managerRepository, managerVerificationRepository, mailerService) {
        this.managerRepository = managerRepository;
        this.managerVerificationRepository = managerVerificationRepository;
        this.mailerService = mailerService;
        this.logger = new common_1.Logger('ManagerService', true);
    }
    async getManagersCount() {
        this.logger.debug('Fetching the count of roles TEACHER and SCHOOL_ADMIN managers');
        try {
            const result = await this.managerRepository.query(`
                SELECT 
                    SUM(CASE WHEN role = 'TEACHER' THEN 1 ELSE 0 END) AS teacher_count,
                    SUM(CASE WHEN role = 'SCHOOL_ADMIN' THEN 1 ELSE 0 END) AS admin_count
                FROM 
                    manager
            `);
            this.logger.debug(`Count of managers retrieved: ${result}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to fetch the count of managers', error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch the count of managers');
        }
    }
    async deleteManagers(ids) {
        try {
            for (let i = 0; i < ids.length; i++) {
                const classroomIds = await this.managerRepository.query(`
                    SELECT id FROM classroom WHERE "managerId" = $1
                `, [ids[i]]);
                if (classroomIds && classroomIds.length) {
                    const classroomIdsArray = classroomIds.map(classroom => classroom.id);
                    await this.managerRepository.query(`
                        DELETE FROM Student WHERE "classroomId" = ANY($1::uuid[])
                    `, [classroomIdsArray]);
                    await this.managerRepository.query(`
                        DELETE FROM classroom WHERE id = ANY($1::uuid[])
                    `, [classroomIdsArray]);
                }
                const result = await this.managerRepository.query(`
                    DELETE FROM manager WHERE id = $1
                `, [ids[i]]);
                console.log(result);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async deleteManagerVerifications(ids) {
        try {
            for (let i = 0; i < ids.length; i++) {
                const result = await this.managerRepository.query(`
                    DELETE FROM manager_verification WHERE id = $1
                `, [ids[i]]);
                console.log(result);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async createManager(createManagerDto, isVerified) {
        const { email } = createManagerDto;
        if (isVerified) {
            try {
                await this.managerVerificationRepository.query('insert into manager_verification (email, "verificationCode", "isVerified", "updatedAt") VALUES($1,$2,$3,$4)', [email, 'VERIFIED', true, new Date()]);
            }
            catch (error) {
                this.logger.error(`Failed to create manager verification while creating manager`, error.stack);
                throw new common_1.InternalServerErrorException(error);
            }
        }
        return this.managerRepository.createManager(createManagerDto);
    }
    async sendInvite(sendInviteDto) {
        const verificationCode = (0, uuid_1.v4)();
        const defaultPassword = 'Test2341!';
        const { email, name, schoolId } = sendInviteDto;
        const host = 'https://coditeach.kz';
        const link = `${host}/verify/${verificationCode}`;
        const managerVerification = await this.managerVerificationRepository.findOne({
            email
        });
        if (managerVerification) {
            const { updatedAt } = managerVerification;
            const sendInviteDate = String(new Date(updatedAt).getFullYear()) +
                String(new Date(updatedAt).getMonth()) +
                String(new Date(updatedAt).getDate());
            const currentDate = String(new Date().getFullYear()) +
                String(new Date().getMonth()) +
                String(new Date().getDate());
            if (currentDate === sendInviteDate) {
                if (managerVerification.limitCount >= 5) {
                    throw new common_1.ForbiddenException({
                        message: 'Too many requests in 24 hours',
                        code: 403009,
                    });
                }
                else {
                    await this.sendVerificationEmail(email, name, link);
                    await this.managerVerificationRepository.update(managerVerification.id, {
                        verificationCode: verificationCode,
                        isVerified: false,
                        limitCount: managerVerification.limitCount + 1,
                    });
                }
            }
            else {
                await this.sendVerificationEmail(email, name, link);
                await this.managerVerificationRepository.update(managerVerification.id, {
                    updatedAt: new Date(),
                    verificationCode: verificationCode,
                    isVerified: false,
                    limitCount: 1,
                });
            }
        }
        else {
            await this.createManager({ email, name, school: schoolId, role: role_status_enum_1.ManagerRole.TEACHER, password: defaultPassword, profile_image: '' });
            await this.managerVerificationRepository.createManagerVerification({ email, verificationCode, isVerified: false });
            await this.sendVerificationEmail(email, name, link);
        }
    }
    async sendVerificationEmail(email, name, link) {
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@codiplay.kz',
            subject: 'CodiTeach educational platform email verification',
            template: 'invite',
            context: {
                name,
                link
            }
        });
    }
    async getTeachers(filterDto, manager) {
        return this.managerRepository.getTeachers(filterDto, manager);
    }
    async getAllManagers() {
        return this.managerRepository.query(`
        select m.id, m.name, m.email, m.role, m."schoolId", mv."isVerified", m.profile_image from manager as m left join manager_verification as mv on m.email=mv.email`);
    }
    async getManagerVerifications() {
        return this.managerVerificationRepository.query(`select * from manager_verification`);
    }
    async checkVerification(verificationCode) {
        if (verificationCode) {
            const managerVerification = await this.managerVerificationRepository.findOne({
                verificationCode: verificationCode
            });
            if (managerVerification) {
                if (managerVerification.isVerified) {
                    throw new common_1.ForbiddenException({
                        message: 'Already verified',
                        code: 403009,
                    });
                }
                else {
                    const { updatedAt } = managerVerification;
                    const diff = new Date().getTime() - updatedAt.getTime();
                    const hoursDiff = ((diff / 1000) / 60) / 60;
                    if (hoursDiff > 24) {
                        throw new common_1.ForbiddenException({
                            message: 'Verification code expired',
                            code: 403009,
                        });
                    }
                    else {
                        return this.managerRepository.findOne({
                            email: managerVerification.email
                        });
                    }
                }
            }
            else {
                console.log('NOT VERIFIED');
                throw new common_1.ForbiddenException({
                    message: 'Verification code not found',
                    code: 403009,
                });
            }
        }
    }
    async completeVerification(completeVerificationDto) {
        const { id, password, verificationCode } = completeVerificationDto;
        try {
            await this.managerRepository.updateManager({
                id: id,
                password: password
            });
            await this.managerVerificationRepository.update({
                verificationCode: verificationCode
            }, {
                isVerified: true,
                updatedAt: new Date()
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
    }
};
ManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_repository_1.ManagerRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(manager_verification_repository_1.ManagerVerificationRepository)),
    __metadata("design:paramtypes", [manager_repository_1.ManagerRepository,
        manager_verification_repository_1.ManagerVerificationRepository,
        mailer_1.MailerService])
], ManagerService);
exports.ManagerService = ManagerService;
//# sourceMappingURL=manager.service.js.map