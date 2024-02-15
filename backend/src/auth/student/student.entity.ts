import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";
import {Classroom} from "../../classrooms/classroom.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({unique: true})
    accountId: string

    @Column()
    @Exclude()
    password: string

    @Column({nullable: false})
    classroomId: string;

    @ManyToOne(() => Classroom, (classroom) => classroom.students)
    classroom: Classroom;

    @Column({nullable: true})
    profile_image: string
}