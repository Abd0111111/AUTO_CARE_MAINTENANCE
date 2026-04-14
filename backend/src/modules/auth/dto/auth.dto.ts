import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsMatch } from 'src/common';

export class SendForgotPasswordDTO {
  @IsEmail()
  email: string;
}

export class VerifyForgotPasswordDTO extends SendForgotPasswordDTO {
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResetForgotPasswordDTO extends VerifyForgotPasswordDTO {
  @IsString()
  @MinLength(6)
  password: string;
}

export class ResendConfirmEmailDTO {
  @IsEmail()
  email: string;
}
export class ConfirmEmailDTO extends ResendConfirmEmailDTO {
  @Matches(/^\d{6}$/)
  otp: string;
}

export class LoginBodyDTO extends ResendConfirmEmailDTO {
  @IsStrongPassword()
  password: string;
}

export class SignupBodyDTO extends LoginBodyDTO {
  @Length(2, 52)
  @IsNotEmpty()
  @IsString()
  username: string;
  @ValidateIf((data: SignupBodyDTO) => {
    return Boolean(data.password);
  })
  @IsMatch<string>(['password'])
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^01[0125][0-9]{8}$/, {
    message: 'Phone must be a valid Egyptian number',
  })
  phone: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  drivingExperience: number;
}

export class GmailDTO {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}


