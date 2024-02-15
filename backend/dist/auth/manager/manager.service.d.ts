import { ManagerRepository } from "./manager.repository";
import { CreateManagerDto } from "./dto/create-manager.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { SendInviteDto } from "./dto/send-invite.dto";
import { ManagerVerificationRepository } from "./verification/manager-verification.repository";
import { GetTeachersFilterDto } from "./dto/get-teachers-filter.dto";
import { Manager } from "./manager.entity";
import { CompleteVerificationDto } from "./dto/complete-verification.dto";
export declare class ManagerService {
    private managerRepository;
    private managerVerificationRepository;
    private readonly mailerService;
    private logger;
    constructor(managerRepository: ManagerRepository, managerVerificationRepository: ManagerVerificationRepository, mailerService: MailerService);
    getManagersCount(): Promise<number>;
    deleteManagers(ids: string[]): Promise<void>;
    deleteManagerVerifications(ids: string[]): Promise<void>;
    createManager(createManagerDto: CreateManagerDto, isVerified?: boolean): Promise<void>;
    sendInvite(sendInviteDto: SendInviteDto): Promise<void>;
    sendVerificationEmail(email: string, name: string, link: string): Promise<void>;
    getTeachers(filterDto: GetTeachersFilterDto, manager: Manager): Promise<Manager[]>;
    getAllManagers(): Promise<any>;
    getManagerVerifications(): Promise<any>;
    checkVerification(verificationCode: string): Promise<Manager>;
    completeVerification(completeVerificationDto: CompleteVerificationDto): Promise<void>;
}
