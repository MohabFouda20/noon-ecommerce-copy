import { Products } from 'src/products/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;
  @Column({
    type: 'text',
    nullable: true, // or false, depending on your requirement,
  })
  description: string;

  // Many-to-Many relationship with Products
  // One category can have multiple products
  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}
