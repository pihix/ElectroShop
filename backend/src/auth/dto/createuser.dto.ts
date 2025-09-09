import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, NotContains } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  @NotContains(' ', { message: "user name shouldn't countain white spaces" })
  username: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @Length(6, 20)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  roles: string;
  _id;
}
