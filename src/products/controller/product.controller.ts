import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { CreateProductDto } from "../dto/create-product.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get(':id')
    getProductOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getProductOne(id);
    }

    @Post()
    createProduct(@Body() dto: CreateProductDto) {
        this.productService.createProduct(dto);
    }
}