import { ManagerRole } from "../role-status.enum";
import { School } from "../../../schools/schools.entity";
export declare class CreateManagerDto {
    email: string;
    name: string;
    password?: string;
    role: ManagerRole;
    school: School;
    profile_image: string;
}
