import {api, apiService} from "./base.tsx";

export default class SchoolService{
    static async getSchools() {
        return apiService.get(`${api.schools.get}`)
    }

    static async createSchool(data: any) {
        return apiService.post(`${api.schools.create}`, data)
    }
}