import { ManagerService } from "./manager.service";
import { CreateManagerDto } from "./dto/create-manager.dto";
import { SendInviteDto } from "./dto/send-invite.dto";
import { GetTeachersFilterDto } from "./dto/get-teachers-filter.dto";
import { Manager } from "./manager.entity";
import { CompleteVerificationDto } from "./dto/complete-verification.dto";
import { ManagerVerification } from "./verification/manager-verification.entity";
export declare class ManagerController {
    private managerService;
    constructor(managerService: ManagerService);
    getAllManagerCounts(): Promise<number>;
    deleteManagers(ids: string[]): Promise<void>;
    deleteManagerVerifications(ids: string[]): Promise<void>;
    createManager(createManagerDto: CreateManagerDto): Promise<void>;
    sendInvite(sendInviteDto: SendInviteDto): Promise<void>;
    getTeachers(filterDto: GetTeachersFilterDto, manager: Manager): Promise<Manager[]>;
    getAllManagers(): Promise<Manager[]>;
    getManagerVerifications(): Promise<ManagerVerification[]>;
    checkVerificationCode(verificationCode: string): Promise<Manager>;
    completeVerification(completeVerificationDto: CompleteVerificationDto): Promise<void>;
}
