import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDto } from '../user/dto/sign-up.dto';
import { LoginDto } from '../user/dto/login.dto';
import { User, UserDocument } from '../user/user.schema';
import { RefreshTokenDocument } from './refresh-token/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        @InjectModel('RefreshToken') private refreshTokenModel: Model<RefreshTokenDocument>,
    ) {}
    
    async signup(signupDto: SignupDto): Promise<User> {
        const emailInUse = await this.userModel.findOne({ email : signupDto.email });
        if(emailInUse){
            throw new BadRequestException('Email already in use');

        }
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);

        const newUser = new this.userModel({
        username: signupDto.username,
        email: signupDto.email,
        role: signupDto.role,
        password: hashedPassword,
        });
        return newUser.save();
    }
    
    async login(loginDto: LoginDto) {
        const user = await this.userModel.findOne({ email: loginDto.email });
        if (!user) {
        throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate tokens for the user
        const tokens = await this.generateUserTokens(user._id.toString());
        return tokens;
    }


    async generateUserTokens(userId: string) {
        const accessToken = this.jwtService.sign({ userId }, { expiresIn: '10h' });
        const refreshToken = uuidv4(); 
        await this.storeRefreshToken(refreshToken, userId);
        return { 
          accessToken,
          refreshToken,
        };
    }

    async storeRefreshToken(token: string, userId: string) { // Added type for userId
        // Calculate expiry date 3 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3);
        
        await this.refreshTokenModel.updateOne(
          { userId },
          { $set: { expiryDate, token } },
          {
            upsert: true,
          },
        );
    }

    async refreshTokens(refreshToken: string) {
        const token = await this.refreshTokenModel.findOne({ token: refreshToken });
        if (!token) {
          throw new UnauthorizedException('Invalid refresh token');
        }
        if (token.expiryDate < new Date()) {
          throw new UnauthorizedException('Refresh token expired');
        } 
        const user = await this.userModel.findById(token.userId);
        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        return this.generateUserTokens(user._id.toString());
    }


}
