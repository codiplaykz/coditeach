import { Repository } from "typeorm";
import { Student } from "./student.entity";
import { CreateStudentDto } from "./dto/create-student.dto";
import { Manager } from "../manager/manager.entity";
import { UpdateStudentDto } from "./dto/update-student.dto";
export declare class StudentRepository extends Repository<Student> {
    private logger;
    createStudent(createStudentDto: CreateStudentDto): Promise<Student>;
    createStudents(students: CreateStudentDto[]): Promise<any[]>;
    getStudents(manager: Manager): Promise<any>;
    getAllStudents(): Promise<any>;
    updateStudent(updateStudentDto: UpdateStudentDto): Promise<void>;
}
