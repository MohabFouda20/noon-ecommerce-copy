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
    })
    role: string;

    @Column({
        type: 'boolean',
        nullable: false,
    })
    isVerified: boolean;


    @CreateDateColumn()
    createdAt: Date;
}