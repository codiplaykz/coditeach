import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Manager} from "../auth/manager/manager.entity";
import {Student} from "../auth/student/student.entity";

@Entity()
export class Classroom {
    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column()
    title: string

    @Column()
    code: string

    @Column()
    createdAt: Date

    @ManyToOne(() => Manager, (manager) => manager.classrooms, {
        eager: false,
        onDelete: 'CASCADE',  // Optional: Deletes classroom when the associated manager is deleted
    })
    manager: Manager;

    @Column({ nullable: false }) // The foreign key column that TypeORM will generate
    managerId: string;

    @OneToMany(() => Student, (student) => student.classroom)
    students: Student[];
}