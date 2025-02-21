import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  fileName: string;

  @Column()
  password: string;
}
