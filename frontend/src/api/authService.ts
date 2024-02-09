import {AxiosResponse} from "axios";
import {api, apiService} from "./base.tsx";
import {AuthResponse} from "./models/authResponse.ts";

export default class AuthService{
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return apiService.post<AuthResponse>(api.manager.login, {email, password })
    }

    static async changePass(data: {id: string, password: string, isStudent?: boolean }): Promise<AxiosResponse<AuthResponse>> {
        if (data.isStudent) {
            return apiService.put(api.student.change_pass, data)
        } else {
            return apiService.put(api.manager.change_pass, data)
        }
    }
}