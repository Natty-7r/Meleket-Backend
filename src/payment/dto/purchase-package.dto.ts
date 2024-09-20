import { PaymentMethod } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEnum } from 'class-validator'

export default class PurchasePackageDto {
  @ApiProperty({
    description: 'Unique identifier for the business',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({
    description: 'Unique identifier for the package selected ',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  packageId: string

  @ApiProperty({
    description: 'payment method',
    example: 'CHAPA',
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @ApiProperty({
    description: 'callback url to redirect the client after payment',
    example: 'localhost:8080',
  })
  @IsString()
  @IsNotEmpty()
  callbackUrl: string
}
