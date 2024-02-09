import {api, apiService} from "./base.tsx";

export default class ClassroomService{
    static async getClassrooms() {
        return apiService.get(`${api.classroom.get}`)
    }

    static async createClassroom(data: any) {
        return apiService.post(`${api.classroom.create}`, data)
    }

    static async deleteClassroom(code: string) {
        return apiService.delete(`${api.classroom.delete}/${code}`)
    }
}