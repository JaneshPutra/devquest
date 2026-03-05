import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshDto {
    @IsString()
    @IsNotEmpty({ message: 'Refresh token tidak boleh kosong' })
    refresh_token: string;
}
