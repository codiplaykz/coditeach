import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {SchoolsRepository} from "./schools.repository";
import {School} from "./schools.entity";
import {CreateSchoolDto} from "./dto/create-school.dto";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class SchoolsService {
    constructor(
        @InjectRepository(SchoolsRepository)
        private schoolsRepository: SchoolsRepository
    ) {}

    getSchools(){
        return this.schoolsRepository.getSchools()
    }

    createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
        return this.schoolsRepository.createSchool(createSchoolDto)
    }

}