import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// All auth endpoints: max 10 req/min per IP
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto) {
        const result = await this.authService.register(dto);
        return { success: true, data: result };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        const result = await this.authService.login(dto);
        return { success: true, data: result };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() dto: RefreshDto) {
        const result = await this.authService.refresh(dto.refresh_token);
        return { success: true, data: result };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req: { user: { id: string } }) {
        const result = await this.authService.logout(req.user.id);
        return { success: true, data: result };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Request() req: { user: { id: string } }) {
        const result = await this.authService.me(req.user.id);
        return { success: true, data: result };
    }
}
