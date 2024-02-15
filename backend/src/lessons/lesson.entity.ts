import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    language: string

    @Column()
    grade: number

    @Column()
    chapterQueue: number

    @Column()
    chapter: string

    @Column()
    topicTitle: string

    @Column()
    topicQueue: number

    @Column()
    lessonType: string

    @Column()
    lessonObjectives: string

    @Column({nullable: true})
    lessonEquipment: string

    @Column({nullable: true})
    priorKnowledge: string

    @Column()
    lessonStart: string

    @Column()
    lessonMiddle: string

    @Column()
    lessonEnd: string

    @Column({nullable: true})
    videoLinks: string

    @Column({nullable: true})
    presentationLinks: string

    @Column({nullable: true})
    linkForDoc: string

    @Column({nullable: true})
    additionalResources: string
}