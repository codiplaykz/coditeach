import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Manager} from "../../auth/manager/manager.entity";

export class CreateClassroomDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    managerId?: string;
}