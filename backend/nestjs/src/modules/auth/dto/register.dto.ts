import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email đăng ký' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu (tối thiểu 6 ký tự)' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(50, { message: 'Mật khẩu không được quá 50 ký tự' })
  password: string;

  @ApiProperty({ example: 'Văn A', description: 'Tên' })
  @IsString()
  @MinLength(1, { message: 'Tên không được để trống' })
  @MaxLength(50, { message: 'Tên không được quá 50 ký tự' })
  firstName: string;

  @ApiProperty({ example: 'Nguyễn', description: 'Họ' })
  @IsString()
  @MinLength(1, { message: 'Họ không được để trống' })
  @MaxLength(50, { message: 'Họ không được quá 50 ký tự' })
  lastName: string;

  @ApiPropertyOptional({ example: '0987654321', description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  @Matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  phone?: string;
}
