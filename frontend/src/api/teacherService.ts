import {AxiosResponse} from "axios";
import {api, apiService} from "./base.tsx";
import {AuthResponse} from "./models/authResponse.ts";
import {TeachersResponse} from "./models/teachersResponse.ts";

export default class TeacherService{
    static async inviteManager(data: {schoolId: string, name: string, email: string}): Promise<AxiosResponse<AuthResponse>> {
        return apiService.post(api.manager.invite, data)
    }

    static async getTeachers(schoolId?: string): Promise<AxiosResponse<TeachersResponse[]>> {
        return apiService.get(`${api.manager.get}${schoolId ? `?schoolId=${schoolId}` : ''}`)
    }

    static async checkVerification(verificationCode: string){
        return apiService.get(`${api.manager.check}/${verificationCode}`)
    }

    static async completeVerification(data: any) {
        return apiService.post(`${api.manager.complete}`, data)
    }
}