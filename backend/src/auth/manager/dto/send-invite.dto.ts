import {IsEmail, IsOptional, IsString} from "class-validator";

export class SendInviteDto {
    @IsEmail()
    email: string

    @IsString()
    name: string

    @IsString()
    schoolId: string
}