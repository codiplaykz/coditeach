import {IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength} from 'class-validator';
import {School} from "../../../schools/schools.entity";

export class UpdateStudentDto {
    @IsString()
    id: string

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password is weak'})
    password?: string

    @IsOptional()
    @IsString()
    accountId?: string

    @IsOptional()
    @IsString()
    classroomId?: string
}

