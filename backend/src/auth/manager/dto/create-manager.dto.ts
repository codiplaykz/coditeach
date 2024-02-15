import {IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength} from "class-validator";
import {ManagerRole} from "../role-status.enum";
import {School} from "../../../schools/schools.entity";

export class CreateManagerDto {
    @IsEmail()
    email: string

    @IsString()
    name: string

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password is weak'})
    password?: string

    @IsString()
    role: ManagerRole

    @IsString()
    school: School

    @IsOptional()
    @IsString()
    profile_image: string
}

