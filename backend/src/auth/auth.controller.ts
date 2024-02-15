import {Body, Controller, Post, Put} from '@nestjs/common';
import {SignUpCredentialsDto} from "./dto/signup-credentials.dto";
import {AuthService} from "./auth.service";
import {SignInCredentialsDto} from "./dto/signin-credentials.dto";
import {Manager} from "./manager/manager.entity";
import {StudentSignInCredentialsDto} from "./dto/student-sign-in-credentials.dto";
import {ChangePassCredentialsDto} from "./dto/change-pass-credentials.dto";
import {UpdateManagerDto} from "./manager/dto/update-manager.dto";
import {UpdateStudentDto} from "./student/dto/update-student.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/manager/sign_in')
    managerSignIn(@Body() signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string, userData: Object, isVerified: boolean }>{
        return this.authService.managerSignIn(signInCredentialsDto)
    }

    @Post('/student/sign_in')
    studentSignIn(@Body() studentSignInCredentialsDto: StudentSignInCredentialsDto): Promise<{ accessToken: string, userData: Object, isVerified: boolean }>{
        return this.authService.studentSignIn(studentSignInCredentialsDto)
    }

    @Put('/manager/change_pass')
    changeManagerPass(@Body() updateManagerDto: UpdateManagerDto) {
        return this.authService.changeManagerPassword(updateManagerDto)
    }

    @Put('/student/change_pass')
    changeStudentPass(@Body() updateStudentDto: UpdateStudentDto) {
        return this.authService.changeStudentPassword(updateStudentDto)
    }
}
