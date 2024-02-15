import { SignInCredentialsDto } from "./dto/signin-credentials.dto";
import { JwtService } from "@nestjs/jwt";
import { ManagerRepository } from "./manager/manager.repository";
import { StudentSignInCredentialsDto } from "./dto/student-sign-in-credentials.dto";
import { StudentRepository } from "./student/student.repository";
import { UpdateManagerDto } from "./manager/dto/update-manager.dto";
import { UpdateStudentDto } from "./student/dto/update-student.dto";
export declare class AuthService {
    private managerRepository;
    private studentRepository;
    private jwtService;
    constructor(managerRepository: ManagerRepository, studentRepository: StudentRepository, jwtService: JwtService);
    changeManagerPassword(updateManagerDto: UpdateManagerDto): Promise<void>;
    changeStudentPassword(updateStudentDto: UpdateStudentDto): Promise<void>;
    managerSignIn(signInCredentialsDto: SignInCredentialsDto): Promise<{
        isVerified: boolean;
        accessToken: string;
        userData: Object;
    }>;
    studentSignIn(studentSignInCredentialsDto: StudentSignInCredentialsDto): Promise<{
        isVerified: boolean;
        accessToken: string;
        userData: Object;
    }>;
}
