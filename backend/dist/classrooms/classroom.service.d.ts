import { Classroom } from "./classroom.entity";
import { CreateClassroomDto } from "./dto/create-classroom";
import { ClassroomRepository } from "./classroom.repository";
import { Manager } from "../auth/manager/manager.entity";
export declare class ClassroomService {
    private classroomRepository;
    private logger;
    constructor(classroomRepository: ClassroomRepository);
    getClassrooms(manager: Manager): Promise<any>;
    createClassroom(createClassroomDto: CreateClassroomDto, manager: Manager): Promise<Classroom>;
    deleteClassroom(classroomCode: string): Promise<void>;
    getClassroomsCount(manager?: Manager): Promise<{
        classroom_count: number;
        students_count: number;
    }>;
    checkClassroomCode(classroomCode: string): Promise<Classroom>;
}
