import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Email tidak valid' })
    email: string;

    @IsString()
    @MinLength(3, { message: 'Username minimal 3 karakter' })
    @MaxLength(30, { message: 'Username maksimal 30 karakter' })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Username hanya boleh huruf, angka, dan underscore',
    })
    username: string;

    @IsString()
    @MinLength(8, { message: 'Password minimal 8 karakter' })
    password: string;
}
