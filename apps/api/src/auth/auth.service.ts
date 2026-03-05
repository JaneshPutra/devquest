import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // ─── Register ────────────────────────────────────────────────────────────────

    async register(dto: RegisterDto) {
        // Check uniqueness
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.email }, { username: dto.username }] },
        });

        if (existing) {
            throw new ConflictException(
                existing.email === dto.email
                    ? 'Email sudah terdaftar'
                    : 'Username sudah digunakan',
            );
        }

        const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                username: dto.username,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                total_xp: true,
                current_streak: true,
                longest_streak: true,
                created_at: true,
            },
        });

        const tokens = await this.generateTokens(user.id, user.email);
        return { ...tokens, user };
    }

    // ─── Login ───────────────────────────────────────────────────────────────────

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const tokens = await this.generateTokens(user.id, user.email);

        // Exclude password from returned user
        const { password: _, ...safeUser } = user;
        return { ...tokens, user: safeUser };
    }

    // ─── Refresh ─────────────────────────────────────────────────────────────────

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify<{ sub: string; email: string }>(
                refreshToken,
                { secret: process.env.JWT_REFRESH_SECRET },
            );

            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, email: true, refreshToken: true },
            });

            if (!user?.refreshToken) {
                throw new UnauthorizedException('Refresh token tidak valid');
            }

            const tokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!tokenMatch) {
                throw new UnauthorizedException('Refresh token tidak valid');
            }

            const tokens = await this.generateTokens(user.id, user.email);
            return tokens;
        } catch {
            throw new UnauthorizedException('Refresh token tidak valid atau sudah kadaluarsa');
        }
    }

    // ─── Logout ──────────────────────────────────────────────────────────────────

    async logout(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { message: 'Logout berhasil' };
    }

    // ─── Me ──────────────────────────────────────────────────────────────────────

    async me(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                total_xp: true,
                current_streak: true,
                longest_streak: true,
                created_at: true,
                updated_at: true,
                _count: {
                    select: { badges: true, progress: true },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('User tidak ditemukan');
        }

        const level = Math.floor(user.total_xp / 100) + 1;
        const xp_to_next_level = level * 100 - user.total_xp;

        return { ...user, level, xp_to_next_level };
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────────

    private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);

        // Hash & store the refresh token
        const hashedRefreshToken = await bcrypt.hash(refresh_token, SALT_ROUNDS);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });

        return { access_token, refresh_token };
    }
}
