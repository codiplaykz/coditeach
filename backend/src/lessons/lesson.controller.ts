import {Body, Controller, Delete, Get, Post, Put, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {LessonService} from "./lesson.service";
import {CreateLessonDto} from "./dto/create-lesson.dto";
import {UpdateLessonDto} from "./dto/update-lesson.dto";

@Controller('lesson')
export class LessonController {
    constructor(private lessonService: LessonService) {
    }

    @Get('/count')
    @UseGuards(AuthGuard())
    getAllLessonsCount() {
        return this.lessonService.getLessonsCount()
    }

    @Post()
    @UseGuards(AuthGuard())
    async createLesson(@Body() createLessonDto: CreateLessonDto) {
        return this.lessonService.createLesson(createLessonDto)
    }

    @Put('/update')
    @UseGuards(AuthGuard())
    async updateLesson(@Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonService.updateLesson(updateLessonDto)
    }

    @Get()
    async getLessons() {
        return this.lessonService.getLessons()
    }

    @Delete('/delete')
    @UseGuards(AuthGuard())
    async deleteLessons(@Body('ids') ids: string[]): Promise<void> {
        return this.lessonService.deleteLessons(ids)
    }
}