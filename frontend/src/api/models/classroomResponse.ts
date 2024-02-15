import {StudentResponse} from "./studentResponse.ts";

export interface ClassroomResponse {
    id: string,
    title: string,
    code: string,
    createdAt: string,
    managerId: string,
    students: StudentResponse[]
}