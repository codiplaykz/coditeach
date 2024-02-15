import {Body, Controller, Delete, Get, Post, UseGuards} from "@nestjs/common";
import {StudentService} from "./student.service";
import {CreateStudentDto} from "./dto/create-student.dto";
import {AuthGuard} from "@nestjs/passport";
import {GetManager} from "../get-user.decorator";
import {Manager} from "../manager/manager.entity";

@Controller('student')
export class StudentController {
    constructor(private studentService: StudentService) {
    }

    @Get('/')
    @UseGuards(AuthGuard())
    getStudents(@GetManager() manager: Manager) {
        return this.studentService.getStudents(manager)
    }

    @Get('/get/all')
    @UseGuards(AuthGuard())
    getAllStudents() {
        return this.studentService.getAllStudents()
    }

    @Get('/count')
    @UseGuards(AuthGuard())
    getAllStudentsCount() {
        return this.studentService.getStudentsCount()
    }

    @Delete('/delete')
    @UseGuards(AuthGuard())
    async deleteManagers(@Body('ids') ids: string[]): Promise<void> {
        return this.studentService.deleteStudents(ids)
    }

    @Post('/create')
    createStudent(@Body() createStudentDto: CreateStudentDto) {
        return this.studentService.createStudent(createStudentDto)
    }

    @Post('/create/many')
    createStudents(@Body() students: CreateStudentDto[]) {
        return this.studentService.createStudents(students)
    }
}