import {EntityRepository, Repository} from "typeorm";
import {ManagerVerification} from "./manager-verification.entity";
import {ConflictException, InternalServerErrorException} from "@nestjs/common";
import {CreateManagerVerificationDto} from "./dto/create-manager-verification.dto";

@EntityRepository(ManagerVerification)
export class ManagerVerificationRepository extends Repository<ManagerVerification> {
    async createManagerVerification(createManagerVerificationDto: CreateManagerVerificationDto): Promise<void> {
        const { email, verificationCode, isVerified } = createManagerVerificationDto

        const managerVerification = this.create({
            email, verificationCode, isVerified, updatedAt: new Date()
        })

        try {
            await this.save(managerVerification)
        } catch (error) {
            console.log(error)
            if (error.code === '23505') { //duplicate email
                throw new ConflictException('Email already exists')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }
}