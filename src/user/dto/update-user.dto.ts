import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  readonly name?: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  @MinLength(6)
  readonly password?: string;
}
