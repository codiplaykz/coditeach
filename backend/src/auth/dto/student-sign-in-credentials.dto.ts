import {IsEmail, IsString} from "class-validator";

export class StudentSignInCredentialsDto {
    @IsString()
    accountId: string

    @IsString()
    password: string
}