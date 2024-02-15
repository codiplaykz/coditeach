import {Body, Controller, Get, Logger, Post, UseGuards} from '@nestjs/common';
import {SchoolsService} from "./schools.service";
import {CreateSchoolDto} from "./dto/create-school.dto";
import {School} from "./schools.entity";
import {AuthGuard} from "@nestjs/passport";

@Controller('school')
// @UseGuards(AuthGuard())
export class SchoolsController {
    private logger = new Logger('SchoolController');

    constructor(private schoolService: SchoolsService) {}

    @Get()
    async getSchools(){
        this.logger.verbose("Retrieving all schools")
        return this.schoolService.getSchools()
    }

    @Post('/create')
    async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
        this.logger.verbose("Creating school")
        return this.schoolService.createSchool(createSchoolDto)
    }
}
