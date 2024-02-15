import {Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ClassroomService} from "./classroom.service";
import {CreateClassroomDto} from "./dto/create-classroom";
import {Manager} from "../auth/manager/manager.entity";
import {AuthGuard} from "@nestjs/passport";
import {GetManager} from "../auth/get-user.decorator";
import {FileInterceptor} from "@nestjs/platform-express";
import * as AWS from 'aws-sdk'

@Controller('classroom')
export class ClassroomController {
    constructor(private classroomService: ClassroomService) {
    }

    @Get()
    @UseGuards(AuthGuard())
    async getClassrooms(@GetManager() manager: Manager) {
        return this.classroomService.getClassrooms(manager)
    }

    @Get('/count')
    @UseGuards(AuthGuard())
    getAllClassroomsCount(@GetManager() manager: Manager) {
        return this.classroomService.getClassroomsCount(manager)
    }

    @Post()
    @UseGuards(AuthGuard())
    async createClassroom(@Body() createClassroomDto: CreateClassroomDto,
                          @GetManager() manager: Manager) {
        return this.classroomService.createClassroom(createClassroomDto, manager)
    }

    @Delete('/delete/:classroomCode')
    async deleteClassroom(@Param('classroomCode') classroomCode: string) {
        return this.classroomService.deleteClassroom(classroomCode)
    }

    @Get('/check/:classroomCode')
    async checkClassroomCode(@Param('classroomCode') classroomCode: string) {
        return this.classroomService.checkClassroomCode(classroomCode)
    }
}
