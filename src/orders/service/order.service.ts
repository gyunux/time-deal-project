import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "../dto/create-order.dto";
import { Order } from "../entity/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ProductOption } from "src/products/entity/product-option.entity";

@Injectable()
export class OrderService {
    constructor(
        private dataSource: DataSource, // Spring의 EntityManager 같은 존재

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(ProductOption)
        private readonly productOptionRepository: Repository<ProductOption>,
    ) { }
    async createOrder(createOrderDto: CreateOrderDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            const option = await queryRunner.manager.findOne(ProductOption, {
                where: {
                    product: { id: createOrderDto.productId },
                    color: createOrderDto.color,
                    size: createOrderDto.size
                },
                relations: ['product'],

                lock: { mode: 'pessimistic_write' },
            });

            if (!option) {
                throw new NotFoundException('해당 상품을 찾을 수 없습니다');
            }

            if (option.stock <= 0) {
                throw new BadRequestException('재고가 부족합니다(품절)');
            }

            option.stock -= 1;
            await queryRunner.manager.save(option);

            const order = queryRunner.manager.create(Order, {
                userId: Math.floor(Math.random() * 10000) + 1,
                productOption: option,
                quantity: 1,
                totalPrice: option.product.price
            });

            await queryRunner.manager.save(order);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release()
        }
    }
}


