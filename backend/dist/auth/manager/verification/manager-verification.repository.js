"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerVerificationRepository = void 0;
const typeorm_1 = require("typeorm");
const manager_verification_entity_1 = require("./manager-verification.entity");
const common_1 = require("@nestjs/common");
let ManagerVerificationRepository = class ManagerVerificationRepository extends typeorm_1.Repository {
    async createManagerVerification(createManagerVerificationDto) {
        const { email, verificationCode, isVerified } = createManagerVerificationDto;
        const managerVerification = this.create({
            email, verificationCode, isVerified, updatedAt: new Date()
        });
        try {
            await this.save(managerVerification);
        }
        catch (error) {
            console.log(error);
            if (error.code === '23505') {
                throw new common_1.ConflictException('Email already exists');
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
};
ManagerVerificationRepository = __decorate([
    (0, typeorm_1.EntityRepository)(manager_verification_entity_1.ManagerVerification)
], ManagerVerificationRepository);
exports.ManagerVerificationRepository = ManagerVerificationRepository;
//# sourceMappingURL=manager-verification.repository.js.map