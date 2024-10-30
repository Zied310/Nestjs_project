import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from './auth-guard'; // Import your guard
import { Request } from 'express';
import { LoginDto } from 'src/user/dto/login.dto';
import { SignupDto } from 'src/user/dto/sign-up.dto';
/* import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum'; */

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //@Roles(Role.Admin) //Enable if you want to test the role guard
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('refresh-tokens')
    @UseGuards(AuthenticationGuard)
    async refreshTokens(@Req() request: Request) {
        const refreshToken = request.body.refreshToken;
        return this.authService.refreshTokens(refreshToken);
    }

}