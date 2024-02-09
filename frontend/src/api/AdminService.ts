import {AxiosResponse} from "axios";
import {api, apiService} from "./base.tsx";
import {AuthResponse} from "./models/authResponse.ts";
import {CreateLessonDto} from "../pages/curriculums/createLessonDrawer.tsx";
import {UpdateLessonDto} from "../pages/curriculums/updateLessonDrawer.tsx";

export default class AdminService{
    static async inviteSchoolManager(data: {school: string, name: string, email: string, password?: string, role: string}): Promise<AxiosResponse<AuthResponse>> {
        return apiService.post(api.manager.create_account, data)
    }

    static async updateLesson(data: UpdateLessonDto) {
        return apiService.put(api.admin.curriculums.lesson.update, data)
    }

    static async createLesson(data: CreateLessonDto) {
        return apiService.post(api.admin.curriculums.lesson.create, data)
    }

    static async getLessons() {
        return apiService.get(api.admin.curriculums.lesson.create)
    }

    static async deleteLessons(ids: string[]) {
        return apiService.delete(api.admin.curriculums.lesson.delete, {data: {ids: ids}})
    }

    static async createCurriculum(data: any): Promise<AxiosResponse<AuthResponse>> {
        return apiService.post(api.admin.curriculums.test, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    static async getAllManagers() {
        return apiService.get(api.admin.managers.get)
    }

    static async getAllStudents() {
        return apiService.get(api.admin.students.get)
    }

    static async getAllManagerVerifications() {
        return apiService.get(api.admin.managers.verification.get)
    }

    static async deleteStudents(ids: string[]) {
        return apiService.delete(api.admin.students.delete, {data: {ids: ids}})
    }

    static async deleteManagers(ids: string[]) {
        return apiService.delete(api.admin.managers.delete, {data: {ids: ids}})
    }

    static async deleteManagersVerifications(ids: string[]) {
        return apiService.delete(api.admin.managers.verification.delete, {data: {ids: ids}})
    }

}