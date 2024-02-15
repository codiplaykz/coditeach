import { ClassroomService } from "./classroom.service";
import { CreateClassroomDto } from "./dto/create-classroom";
import { Manager } from "../auth/manager/manager.entity";
export declare class ClassroomController {
    private classroomService;
    constructor(classroomService: ClassroomService);
    getClassrooms(manager: Manager): Promise<any>;
    getAllClassroomsCount(manager: Manager): Promise<{
        classroom_count: number;
        students_count: number;
    }>;
    createClassroom(createClassroomDto: CreateClassroomDto, manager: Manager): Promise<import("./classroom.entity").Classroom>;
    deleteClassroom(classroomCode: string): Promise<void>;
    checkClassroomCode(classroomCode: string): Promise<import("./classroom.entity").Classroom>;
}
