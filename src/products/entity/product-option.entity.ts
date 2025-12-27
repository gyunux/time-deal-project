import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    color: string;

    @Column()
    size: string;

    @Column({ type: 'int' })
    stock: number;

    @ManyToOne(() => Product, (product) => product.options, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

}