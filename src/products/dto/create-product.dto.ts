import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";

export class CreateProductOptionDto {
    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    size: string;

    @IsNumber()
    @Min(0)
    stock: number;
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    image: string;

    //계층형 검증 설정(Java의 @Valid List<>
    @IsArray()//배열인지 검증
    @ValidateNested({ each: true }) // 배열 내부의 객체들도 하나하나 검증
    @Type(() => CreateProductOptionDto) // 들어온 JSON 객체를 이 클래스(Dto)로 변환
    options: CreateProductOptionDto[];
}