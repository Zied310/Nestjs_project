import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from '../is-object-id.validator';

export class CreateOrderDto {
  @IsObjectId()
  user: Types.ObjectId; // Reference to the user

  @IsArray()
  @IsObjectId({ each: true })
  products: Types.ObjectId[]; // Array of product references

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

  @IsString()
  @IsNotEmpty()
  readonly status: string; // Exemples : "Pending", "Shipped", "Delivered", "Cancelled"
}