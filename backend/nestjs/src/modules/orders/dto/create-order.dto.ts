import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  country?: string;
}

export class CreateOrderDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  @IsOptional()
  billingAddress?: ShippingAddressDto;

  @IsString()
  @IsNotEmpty()
  paymentMethod: 'cod' | 'vnpay' | 'momo' | 'bank_transfer';

  @IsString()
  @IsOptional()
  notes?: string;
}
