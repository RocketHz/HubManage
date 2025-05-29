import { IsString, IsNumber, IsNotEmpty, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string = '';

  @IsString()
  @MaxLength(500)
  description: string = '';

  @IsNumber()
  @Min(0)
  price: number = 0;

  @IsNumber()
  @Min(0)
  stock: number = 0;
}

