import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { OrderService } from "../service/order.service";
import { CreateOrderDto } from "../dto/create-order.dto";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }
}