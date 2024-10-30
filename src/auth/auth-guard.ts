import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Invalid token');
        }

        try {
            const payload = this.jwtService.verify(token);
            request.userId = payload.userId; // Assuming userId is in the token payload
            return true; // Access granted
        } catch (e) {
            Logger.error(e.message);
            throw new UnauthorizedException('Invalid Token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        // Use 'Bearer ' prefix to split the token correctly
        const authHeader = request.headers.authorization;
        if (!authHeader) return undefined;
        
        const parts = authHeader.split(' '); // Split by space
        return parts.length === 2 ? parts[1] : undefined; // Return the token part if exists
    }
}
