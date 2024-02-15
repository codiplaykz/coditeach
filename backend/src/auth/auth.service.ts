import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SignInCredentialsDto} from "./dto/signin-credentials.dto";
import * as bcrypt from 'bcrypt'
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "./dto/jwt-payload.interface";
import {ManagerRepository} from "./manager/manager.repository";
import {Manager} from "./manager/manager.entity";
import {StudentSignInCredentialsDto} from "./dto/student-sign-in-credentials.dto";
import {StudentRepository} from "./student/student.repository";
import {ChangePassCredentialsDto} from "./dto/change-pass-credentials.dto";
import {UpdateManagerDto} from "./manager/dto/update-manager.dto";
import {UpdateStudentDto} from "./student/dto/update-student.dto";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(ManagerRepository)
                private managerRepository: ManagerRepository,
                @InjectRepository(StudentRepository)
                private studentRepository: StudentRepository,
                private jwtService: JwtService) {
    }

    async changeManagerPassword(updateManagerDto: UpdateManagerDto) {
        const { id, password } = updateManagerDto
        return this.managerRepository.updateManager({id: id, password: password})
    }

    async changeStudentPassword(updateStudentDto: UpdateStudentDto) {
        const { id, password } = updateStudentDto
        return this.studentRepository.updateStudent({id: id, password: password})
    }

    async managerSignIn(signInCredentialsDto: SignInCredentialsDto): Promise<{isVerified: boolean, accessToken: string, userData: Object}> {
        const { email, password } = signInCredentialsDto

        // @ts-ignore
        let manager = await this.managerRepository.getManager(email)
        manager = manager[0]

        if (manager) {
            if (manager.isVerified || manager.role === 'SCHOOL_ADMIN') {
                if (manager && (await bcrypt.compare(password, manager.password))) {
                    const payload: JwtPayload = { email }
                    const accessToken = this.jwtService.sign(payload)
                    const userData = {
                        id: manager.id,
                        schoolId: manager.schoolId,
                        name: manager.name,
                        email: manager.email,
                        role: manager.role,
                        profile_image: manager.profile_image,
                    }
                    return {isVerified: true, accessToken, userData};
                } else {
                    throw new UnauthorizedException(['Please check your login credentials'])
                }
            } else {
                throw new UnauthorizedException(['Your account is not verified'])
            }
        } else {
            throw new UnauthorizedException(['Please check your login credentials'])
        }
    }

    async studentSignIn(studentSignInCredentialsDto: StudentSignInCredentialsDto): Promise<{isVerified: boolean, accessToken: string, userData: Object}> {
        const { accountId, password } = studentSignInCredentialsDto

        // @ts-ignore
        let student = await this.studentRepository.findOne({
            accountId: accountId
        })

        if (student) {
            if (student && (await bcrypt.compare(password, student.password))) {
                const payload: JwtPayload = { email: accountId }
                const accessToken = this.jwtService.sign(payload)
                const userData = {
                    name: student.name,
                    accountId: student.accountId,
                    classroomId: student.classroomId,
                    email: student.accountId,
                    profile_image: student.profile_image,
                }
                return {isVerified: true, accessToken, userData};
            } else {
                throw new UnauthorizedException(['Invalid credentials'])
            }
        } else {
            throw new UnauthorizedException(['Please check your login credentials'])
        }
    }
}
