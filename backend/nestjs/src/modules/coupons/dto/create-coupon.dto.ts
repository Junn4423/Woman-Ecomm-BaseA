import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountType } from '../schemas/coupon.schema';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderValue?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscountAmount?: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  @Min(0)
  @IsOptional()
  usageLimit?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  usageLimitPerUser?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableCategories?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  applicableProducts?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  excludedProducts?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFirstOrderOnly?: boolean;
}
