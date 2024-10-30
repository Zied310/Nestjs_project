import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../user/user.schema'; // Adjust the path if necessary
import { Product } from '../product/product.schema'; // Adjust the path if necessary

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: User[]; 

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Product' })
  products: Product[];

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);