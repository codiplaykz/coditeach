import { AuthService } from "./auth.service";
import { SignInCredentialsDto } from "./dto/signin-credentials.dto";
import { StudentSignInCredentialsDto } from "./dto/student-sign-in-credentials.dto";
import { UpdateManagerDto } from "./manager/dto/update-manager.dto";
import { UpdateStudentDto } from "./student/dto/update-student.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    managerSignIn(signInCredentialsDto: SignInCredentialsDto): Promise<{
        accessToken: string;
        userData: Object;
        isVerified: boolean;
    }>;
    studentSignIn(studentSignInCredentialsDto: StudentSignInCredentialsDto): Promise<{
        accessToken: string;
        userData: Object;
        isVerified: boolean;
    }>;
    changeManagerPass(updateManagerDto: UpdateManagerDto): Promise<void>;
    changeStudentPass(updateStudentDto: UpdateStudentDto): Promise<void>;
}
