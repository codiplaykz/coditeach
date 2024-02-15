import {IsString, Matches, MaxLength, MinLength} from "class-validator";

export class CreateStudentDto {
    @IsString()
    name: string

    @IsString()
    accountId: string

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    password: string

    @IsString()
    classroomId: string;
}