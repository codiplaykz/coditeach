import { Repository } from "typeorm";
import { ManagerVerification } from "./manager-verification.entity";
import { CreateManagerVerificationDto } from "./dto/create-manager-verification.dto";
export declare class ManagerVerificationRepository extends Repository<ManagerVerification> {
    createManagerVerification(createManagerVerificationDto: CreateManagerVerificationDto): Promise<void>;
}
