import { Length, IsEmail } from "class-validator";
import { PasswordInput } from "../../shared/PasswordInput";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExists } from "./isEmailAlreadyExists";

@InputType()
export class RegisterInput extends PasswordInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExists({ message: "Email is already used, try another email" })
  email: string;
}
