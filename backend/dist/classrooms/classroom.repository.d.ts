import { Repository } from "typeorm";
import { Classroom } from "./classroom.entity";
import { CreateClassroomDto } from "./dto/create-classroom";
import { Manager } from "../auth/manager/manager.entity";
export declare class ClassroomRepository extends Repository<Classroom> {
    private logger;
    generateClassCode(): string;
    getClassrooms(manager: Manager): Promise<any>;
    createClassroom(createClassroomDto: CreateClassroomDto, manager: Manager): Promise<Classroom>;
    deleteClassroom(classroomCode: string): Promise<void>;
}
