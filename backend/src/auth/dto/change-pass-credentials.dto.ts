import {IsString} from "class-validator";

export class ChangePassCredentialsDto {
    @IsString()
    userId: string

    @IsString()
    password: string

    @IsString()
    repeatPassword: string
}