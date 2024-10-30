import { IsArray, IsOptional, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from '../is-object-id.validator'; // Ensure the path is correct

export class UpdateOrderDto {
  @IsOptional()
  @IsObjectId()
  user?: Types.ObjectId; 

  @IsOptional() 
  @IsArray()
  @IsObjectId({ each: true })
  products?: Types.ObjectId[]; 

  @IsOptional() 
  @IsNumber()
  quantity?: number; 

  @IsOptional() 
  @IsString()
  status?: string; 
}