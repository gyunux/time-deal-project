import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "../dto/create-order.dto";
import { Order } from "../entity/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductOption } from "src/products/entity/product-option.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(ProductOption)
        private readonly productOptionRepository: Repository<ProductOption>,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto) {
        const option = await this.productOptionRepository.findOne({
            where: {
                product: { id: createOrderDto.productId },
                color: createOrderDto.color,
                size: createOrderDto.size
            },
            relations: ['product']
        });

        if (!option) {
            throw new NotFoundException('해당 상품을 찾을 수 없습니다');
        }

        if (option.stock <= 0) {
            throw new BadRequestException('재고가 부족합니다(품절)');
        }

        option.stock -= 1;
        await this.productOptionRepository.save(option);

        const order = this.orderRepository.create({
            userId: Math.floor(Math.random() * 10000) + 1,
            productOption: option,
            quantity: 1,
            totalPrice: option.product.price
        });

        return await this.orderRepository.save(order);
    }
}


