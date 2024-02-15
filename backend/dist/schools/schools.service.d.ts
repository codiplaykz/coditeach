import { SchoolsRepository } from "./schools.repository";
import { School } from "./schools.entity";
import { CreateSchoolDto } from "./dto/create-school.dto";
export declare class SchoolsService {
    private schoolsRepository;
    constructor(schoolsRepository: SchoolsRepository);
    getSchools(): Promise<any[]>;
    createSchool(createSchoolDto: CreateSchoolDto): Promise<School>;
}
