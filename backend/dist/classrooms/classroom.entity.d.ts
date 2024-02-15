import { Manager } from "../auth/manager/manager.entity";
import { Student } from "../auth/student/student.entity";
export declare class Classroom {
    id: string;
    title: string;
    code: string;
    createdAt: Date;
    manager: Manager;
    managerId: string;
    students: Student[];
}
