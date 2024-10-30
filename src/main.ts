import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/role.guard';
import { jwtConstants } from './auth/constants';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new RolesGuard(new Reflector(), new JwtService({ secret: jwtConstants.secret })));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
