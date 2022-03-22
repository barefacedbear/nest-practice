import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, unique: true })
    email!: string;

    @Column()
    password!: string;

    @AfterInsert()
    logInsert() {
        console.log(`Row created with email: ${this.email}`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`Row updated with id: ${this.id}`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`Row deleted with id: ${this.id}`);
    }
}
