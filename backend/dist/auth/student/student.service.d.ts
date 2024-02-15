import { StudentRepository } from "./student.repository";
import { ClassroomRepository } from "../../classrooms/classroom.repository";
import { CreateStudentDto } from "./dto/create-student.dto";
import { Manager } from "../manager/manager.entity";
export declare class StudentService {
    private studentRepository;
    private classroomRepository;
    private readonly logger;
    constructor(studentRepository: StudentRepository, classroomRepository: ClassroomRepository);
    getStudentsCount(): Promise<number>;
    deleteStudents(ids: string[]): Promise<void>;
    createStudent(createStudentDto: CreateStudentDto): Promise<import("./student.entity").Student>;
    createStudents(students: CreateStudentDto[]): Promise<any[]>;
    getStudents(manager: Manager): Promise<any>;
    getAllStudents(): Promise<any>;
}
