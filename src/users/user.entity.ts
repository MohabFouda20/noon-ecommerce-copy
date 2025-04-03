import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    firstName: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    lastName: string;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,

    })
    email: string;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 15,
        nullable : false ,
        unique: true,
    })
    phone :string ;

    @Column({
        type: 'varchar',
        length: 10,
        nullable: false,
        default: 'user',
    })
    role: string;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    isVerified: boolean;


    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({
        type:"varchar",
        nullable:true,
        default:'',
    })
    refreshToken:string|null
    
    @Column({
        type:"varchar",
        nullable:true,
        default:'',
    })
    OTP:string|null
}