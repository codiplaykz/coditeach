import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Manager} from "../auth/manager/manager.entity";

@Entity()
export class School {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({nullable: true})
    country: string

    @Column({nullable: true})
    city: string

    @OneToMany(() => Manager, (manager) => manager.school)
    managers: Manager[];
}