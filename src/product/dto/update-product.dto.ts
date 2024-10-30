import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    readonly name?: string;
  
    @IsNumber()
    @Min(0)
    readonly price?: number;
  
    @IsString()
    readonly description?: string;
}
