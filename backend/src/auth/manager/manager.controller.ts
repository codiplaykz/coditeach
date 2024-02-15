import {Body, Controller, Delete, Get, Param, Post, Query, UseGuards} from "@nestjs/common";
import {ManagerService} from "./manager.service";
import {CreateManagerDto} from "./dto/create-manager.dto";
import {Send} from "express";
import {SendInviteDto} from "./dto/send-invite.dto";
import {GetTeachersFilterDto} from "./dto/get-teachers-filter.dto";
import {GetManager} from "../get-user.decorator";
import {Manager} from "./manager.entity";
import {AuthGuard} from "@nestjs/passport";
import {CompleteVerificationDto} from "./dto/complete-verification.dto";
import {ManagerVerification} from "./verification/manager-verification.entity";

@Controller('manager')
export class ManagerController {
    constructor(private managerService: ManagerService) {
    }

    @Get('/count')
    // @UseGuards(AuthGuard())
    getAllManagerCounts() {
        return this.managerService.getManagersCount()
    }

    @Delete('/delete')
    @UseGuards(AuthGuard())
    async deleteManagers(@Body('ids') ids: string[]): Promise<void> {
        return this.managerService.deleteManagers(ids)
    }

    @Delete('/verifications/delete')
    @UseGuards(AuthGuard())
    async deleteManagerVerifications(@Body('ids') ids: string[]): Promise<void> {
        return this.managerService.deleteManagerVerifications(ids)
    }

    @Post('/create')
    @UseGuards(AuthGuard())
    async createManager(@Body() createManagerDto: CreateManagerDto): Promise<void> {
        const defaultPassword = 'Test2341!'
        if (!createManagerDto.password) {
            createManagerDto.password = defaultPassword
        }
        return this.managerService.createManager(createManagerDto, true)
    }

    @Post('/invite')
    @UseGuards(AuthGuard())
    async sendInvite(@Body() sendInviteDto: SendInviteDto): Promise<void> {
        return this.managerService.sendInvite(sendInviteDto)
    }

    @Get('/get')
    @UseGuards(AuthGuard())
    async getTeachers(@Query() filterDto: GetTeachersFilterDto,
                      @GetManager() manager: Manager): Promise<Manager[]>  {
        return this.managerService.getTeachers(filterDto, manager)
    }

    @Get('/get_all')
    @UseGuards(AuthGuard())
    async getAllManagers(): Promise<Manager[]>  {
        return this.managerService.getAllManagers()
    }

    @Get('/verification/get')
    @UseGuards(AuthGuard())
    async getManagerVerifications(): Promise<ManagerVerification[]>  {
        return this.managerService.getManagerVerifications()
    }

    @Get('/check/:verificationCode')
    async checkVerificationCode(@Param('verificationCode') verificationCode: string) {
        return this.managerService.checkVerification(verificationCode)
    }

    @Post('/complete')
    async completeVerification(@Body() completeVerificationDto: CompleteVerificationDto) {
        return this.managerService.completeVerification(completeVerificationDto)
    }
}