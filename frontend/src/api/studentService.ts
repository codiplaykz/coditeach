import {api, apiService} from "./base.tsx";

export default class StudentService{
    static async getStudents() {
        return apiService.get(`${api.student.get}`)
    }

    static async createStudents(students: {accountId: string, name: string, password: string, classroomId: string}[]) {
        return apiService.post(`${api.student.create_many}`, students)
    }
}