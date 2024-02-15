import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ManagerVerification {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({unique: true})
    email: string

    @Column()
    verificationCode: string

    @Column()
    isVerified: boolean

    @Column()
    updatedAt: Date

    @Column({
        default: 1
    })
    limitCount: number
}