import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ErrorHandlerMiddleware } from './common/middleware/error-handler.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './auth/refresh-token/refresh-token.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/test_nestjs'), UserModule, ProductModule, OrderModule, AuthModule, RefreshTokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlerMiddleware).forRoutes('*');
  }
}
