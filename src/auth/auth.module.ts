import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthenticationGuard } from './auth-guard';
import { UserModule } from 'src/user/user.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RefreshTokenSchema } from './refresh-token/refresh-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from './role.guard';

@Module({
  imports : [
    UserModule,
    RefreshTokenModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    MongooseModule.forFeature([{ name: 'RefreshToken', schema: RefreshTokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    AuthenticationGuard,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    }
  ],
  exports: [AuthService],

})
export class AuthModule {}
