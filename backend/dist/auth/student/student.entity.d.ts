import { Classroom } from "../../classrooms/classroom.entity";
export declare class Student {
    id: string;
    name: string;
    accountId: string;
    password: string;
    classroomId: string;
    classroom: Classroom;
    profile_image: string;
}
