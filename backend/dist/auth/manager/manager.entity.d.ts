import { School } from "../../schools/schools.entity";
import { Classroom } from "../../classrooms/classroom.entity";
import { ManagerRole } from "../manager/role-status.enum";
export declare class Manager {
    id: string;
    name: string;
    email: string;
    password: string;
    role: ManagerRole;
    schoolId: string;
    school: School;
    classrooms: Classroom[];
    profile_image: string;
}
