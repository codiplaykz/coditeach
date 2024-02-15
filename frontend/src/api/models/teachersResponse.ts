import {ClassroomResponse} from "./classroomResponse.ts";

export interface TeachersResponse {
    id: string,
    name: string,
    email: string,
    schoolId: string,
    role: string,
    profile_image: string,
    classrooms: ClassroomResponse[],
    isVerified: boolean,
}