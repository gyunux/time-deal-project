import { ProductOption } from "src/products/entity/product-option.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => ProductOption)
    @JoinColumn({ name: 'product_option_id' })
    productOption: ProductOption;

    @Column()
    totalPrice: number;

    @Column({ default: 1 })
    quantity: number;

    @CreateDateColumn()
    createdAt: Date;
}