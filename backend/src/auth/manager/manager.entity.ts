import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";
import {School} from "../../schools/schools.entity";
import {Classroom} from "../../classrooms/classroom.entity";
import {ManagerRole} from "../manager/role-status.enum";

@Entity()
export class Manager {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @Column()
    @Exclude()
    password: string

    @Column()
    role: ManagerRole

    @Column({nullable: false})
    schoolId: string;

    @ManyToOne(() => School, (school) => school.managers)
    school: School;

    @OneToMany(() => Classroom, (classroom) => classroom.manager, {
        eager: true,  // Fetch classrooms whenever you fetch a manager
    })
    classrooms: Classroom[];

    @Column({nullable: true})
    profile_image: string
}