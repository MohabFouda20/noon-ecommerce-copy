import { Products } from 'src/products/product.entity';
import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: 'varchar',
      length: 100,
      nullable: false,
    })
    name: string 
    @Column({
      type: 'text',
      nullable: true, // or false, depending on your requirement, 
    })
    description: string;


    @ManyToOne(() => Category, (category) => category.children)
    parent: Category;
  
    // Self-referencing relationship for child categories
    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];
  
    // Many-to-Many relationship with Products
    // One category can have multiple products
    @ManyToMany(() => Products, (products) => products.categories)
    products: Products[];


  }