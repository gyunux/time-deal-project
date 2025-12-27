import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsString()
    @IsNotEmpty()
    color: string;
    
    @IsString()
    @IsNotEmpty()
    size: string;
}