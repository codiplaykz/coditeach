import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UpdateLessonDto {
    @IsString()
    id: string

    @IsString()
    language: string

    @IsNumber()
    grade: number

    @IsNumber()
    chapterQueue: number

    @IsString()
    chapter: string

    @IsString()
    topicTitle: string

    @IsNumber()
    topicQueue: number

    @IsString()
    lessonType: string

    @IsString()
    lessonObjectives: string

    @IsNotEmpty()
    lessonEquipment: string

    @IsString()
    lessonStart: string

    @IsString()
    lessonMiddle: string

    @IsString()
    lessonEnd: string

    @IsString()
    videoLinks: string

    @IsString()
    presentationLinks: string

    @IsString()
    linkForDoc: string

    @IsString()
    additionalResources: string
}