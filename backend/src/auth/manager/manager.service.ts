import {ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ManagerRepository} from "./manager.repository";
import {CreateManagerDto} from "./dto/create-manager.dto";
import {MailerService} from "@nestjs-modules/mailer";
import {SendInviteDto} from "./dto/send-invite.dto";
import {v4 as uuid} from 'uuid';
import {ManagerRole} from "./role-status.enum";
import {ManagerVerificationRepository} from "./verification/manager-verification.repository";
import {GetTeachersFilterDto} from "./dto/get-teachers-filter.dto";
import {Manager} from "./manager.entity";
import {ManagerVerification} from "./verification/manager-verification.entity";
import {CompleteVerificationDto} from "./dto/complete-verification.dto";

@Injectable()
export class ManagerService {
    private logger = new Logger('ManagerService', true);

    constructor(@InjectRepository(ManagerRepository)
                private managerRepository: ManagerRepository,
                @InjectRepository(ManagerVerificationRepository)
                private managerVerificationRepository: ManagerVerificationRepository,
                private readonly mailerService: MailerService) {
    }

    async getManagersCount(): Promise<number> {
        this.logger.debug('Fetching the count of roles TEACHER and SCHOOL_ADMIN managers');

        try {
            const result = await this.managerRepository.query(`
                SELECT 
                    SUM(CASE WHEN role = 'TEACHER' THEN 1 ELSE 0 END) AS teacher_count,
                    SUM(CASE WHEN role = 'SCHOOL_ADMIN' THEN 1 ELSE 0 END) AS admin_count
                FROM 
                    manager
            `);

            this.logger.debug(`Count of managers retrieved: ${result}`);
            return result; // Return the count
        } catch (error) {
            this.logger.error('Failed to fetch the count of managers', error.stack);
            throw new InternalServerErrorException('Failed to fetch the count of managers'); // Throw an exception
        }
    }

    async deleteManagers(ids: string[]): Promise<void> {
        try {
            for (let i = 0; i<ids.length; i++) {
                const classroomIds = await this.managerRepository.query(`
                    SELECT id FROM classroom WHERE "managerId" = $1
                `, [ids[i]]);

                if (classroomIds && classroomIds.length) {
                    const classroomIdsArray = classroomIds.map(classroom => classroom.id);

                    // Delete Students for these classrooms
                    await this.managerRepository.query(`
                        DELETE FROM Student WHERE "classroomId" = ANY($1::uuid[])
                    `, [classroomIdsArray]);

                    // Delete Classrooms
                    await this.managerRepository.query(`
                        DELETE FROM classroom WHERE id = ANY($1::uuid[])
                    `, [classroomIdsArray]);
                }

                // Delete the Manager
                const result = await this.managerRepository.query(`
                    DELETE FROM manager WHERE id = $1
                `, [ids[i]]);

                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteManagerVerifications(ids: string[]): Promise<void> {
        try {
            for (let i = 0; i<ids.length; i++) {
                // Delete the Manager
                const result = await this.managerRepository.query(`
                    DELETE FROM manager_verification WHERE id = $1
                `, [ids[i]]);

                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async createManager(createManagerDto: CreateManagerDto, isVerified?: boolean): Promise<void> {
        const { email} = createManagerDto
        if (isVerified) {
            try {
                await this.managerVerificationRepository.query('insert into manager_verification (email, "verificationCode", "isVerified", "updatedAt") VALUES($1,$2,$3,$4)', [email, 'VERIFIED', true, new Date()])
            } catch (error) {
                this.logger.error(
                    `Failed to create manager verification while creating manager`,
                    error.stack,
                );
                throw new InternalServerErrorException(error)
            }
        }
        return this.managerRepository.createManager(createManagerDto)
    }

    async sendInvite(sendInviteDto: SendInviteDto): Promise<void> {
        const verificationCode = uuid()
        const defaultPassword = 'Test2341!'
        const { email, name, schoolId } = sendInviteDto
        const host = 'https://coditeach.kz'
        const link = `${host}/verify/${verificationCode}`

        const managerVerification = await this.managerVerificationRepository.findOne({
            email
        })

        if (managerVerification) {
            const { updatedAt } = managerVerification;
            const sendInviteDate =
                String(new Date(updatedAt).getFullYear()) +
                String(new Date(updatedAt).getMonth()) +
                String(new Date(updatedAt).getDate());

            const currentDate =
                String(new Date().getFullYear()) +
                String(new Date().getMonth()) +
                String(new Date().getDate());

            if(currentDate === sendInviteDate) {
                if (managerVerification.limitCount >= 5) {
                    throw new ForbiddenException({
                        message: 'Too many requests in 24 hours',
                        code: 403009,
                    });
                } else {
                    await this.sendVerificationEmail(email, name, link)
                    await this.managerVerificationRepository.update(managerVerification.id, {
                        verificationCode: verificationCode,
                        isVerified: false,
                        limitCount: managerVerification.limitCount + 1,
                    });
                }
            } else {
                await this.sendVerificationEmail(email, name, link)
                await this.managerVerificationRepository.update(managerVerification.id, {
                    updatedAt: new Date(),
                    verificationCode: verificationCode,
                    isVerified: false,
                    limitCount: 1,
                });
            }
        } else {
            // Create manager account
            // @ts-ignore
            await this.createManager({email, name, school: schoolId, role: ManagerRole.TEACHER, password: defaultPassword, profile_image: ''})

            // Creating manager verification entity
            await this.managerVerificationRepository.createManagerVerification({email, verificationCode, isVerified: false})

            await this.sendVerificationEmail(email, name, link)
        }
    }

    async sendVerificationEmail(email: string, name: string, link: string) {
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@codiplay.kz',
            subject: 'CodiTeach educational platform email verification',
            template: 'invite',
            context: {
                name,
                link
            }
        })
    }

    async getTeachers(filterDto: GetTeachersFilterDto, manager: Manager){
        return this.managerRepository.getTeachers(filterDto, manager)
    }

    async getAllManagers(){
        return this.managerRepository.query(`
        select m.id, m.name, m.email, m.role, m."schoolId", mv."isVerified", m.profile_image from manager as m left join manager_verification as mv on m.email=mv.email`)
    }

    async getManagerVerifications(){
        return this.managerVerificationRepository.query(`select * from manager_verification`)
    }

    async checkVerification(verificationCode: string): Promise<Manager> {
        if (verificationCode) {
            const managerVerification = await this.managerVerificationRepository.findOne({
                verificationCode: verificationCode
            })
            if (managerVerification) {
                if (managerVerification.isVerified) {
                    throw new ForbiddenException({
                        message: 'Already verified',
                        code: 403009,
                    });
                } else {
                    const { updatedAt } = managerVerification;
                    const diff = new Date().getTime() - updatedAt.getTime()
                    const hoursDiff = ((diff/1000)/60)/60

                    if (hoursDiff > 24) {
                        throw new ForbiddenException({
                            message: 'Verification code expired',
                            code: 403009,
                        });
                    } else {
                        return this.managerRepository.findOne({
                            email: managerVerification.email
                        })
                    }
                }
            } else {
                console.log('NOT VERIFIED')
                throw new ForbiddenException({
                    message: 'Verification code not found',
                    code: 403009,
                });
            }
        }
    }

    async completeVerification(completeVerificationDto: CompleteVerificationDto): Promise<void> {
        const { id, password, verificationCode } = completeVerificationDto
        //Check verification code
        try {
            await this.managerRepository.updateManager({
                id: id,
                password: password
            })
            await this.managerVerificationRepository.update({
                verificationCode: verificationCode
            }, {
                isVerified: true,
                updatedAt: new Date()
            })
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}