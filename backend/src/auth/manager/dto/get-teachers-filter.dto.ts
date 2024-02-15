import {IsOptional, IsString} from 'class-validator';

export class GetTeachersFilterDto {
    @IsOptional()
    @IsString()
    schoolId?: string;
}
