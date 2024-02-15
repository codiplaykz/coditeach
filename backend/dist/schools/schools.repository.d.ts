import { Repository } from "typeorm";
import { School } from "./schools.entity";
import { CreateSchoolDto } from "./dto/create-school.dto";
export declare class SchoolsRepository extends Repository<School> {
    createSchool(createSchoolDto: CreateSchoolDto): Promise<School>;
    getSchools(): Promise<any[]>;
}
