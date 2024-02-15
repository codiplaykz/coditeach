import {IsNotEmpty} from "class-validator";

export class CreateSchoolDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    country: string

    @IsNotEmpty()
    city: string
}