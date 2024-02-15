import { StudentService } from "./student.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { Manager } from "../manager/manager.entity";
export declare class StudentController {
    private studentService;
    constructor(studentService: StudentService);
    getStudents(manager: Manager): Promise<any>;
    getAllStudents(): Promise<any>;
    getAllStudentsCount(): Promise<number>;
    deleteManagers(ids: string[]): Promise<void>;
    createStudent(createStudentDto: CreateStudentDto): Promise<import("./student.entity").Student>;
    createStudents(students: CreateStudentDto[]): Promise<any[]>;
}
