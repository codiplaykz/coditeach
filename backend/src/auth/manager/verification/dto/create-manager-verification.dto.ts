import {IsBoolean, IsEmail, IsString} from "class-validator";

export class CreateManagerVerificationDto {
    @IsEmail()
    email: string

    @IsString()
    verificationCode: string

    @IsBoolean()
    isVerified: boolean
}

