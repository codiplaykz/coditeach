import { SchoolsService } from "./schools.service";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { School } from "./schools.entity";
export declare class SchoolsController {
    private schoolService;
    private logger;
    constructor(schoolService: SchoolsService);
    getSchools(): Promise<any[]>;
    createSchool(createSchoolDto: CreateSchoolDto): Promise<School>;
}
