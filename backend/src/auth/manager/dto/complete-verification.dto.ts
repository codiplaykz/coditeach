import {IsString} from 'class-validator';

export class CompleteVerificationDto {
    @IsString()
    id: string;

    @IsString()
    password: string;

    @IsString()
    verificationCode: string;
}
