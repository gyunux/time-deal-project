import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "../entity/product.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "../dto/create-product.dto";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async createProduct(dto: CreateProductDto) {
        const product = this.productRepository.create({
            name: dto.productName,
            price: dto.price,
            image: dto.image,
            options: dto.options,
        });

        await this.productRepository.save(product);

        return product;
    }

    async getProductOne(id: number) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['options']
        });

        if (!product) {
            throw new NotFoundException(`상품(ID: ${id}을 찾을 수 없습니다.`);
        }
        return product;
    }
}
