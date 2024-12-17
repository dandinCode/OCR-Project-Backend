import { IsNotEmpty, MinLength, IsEmail } from "class-validator";

export class CreateUserBody {
    @IsNotEmpty({
        message: 'The email should not be empty.',
    })
    @IsEmail()
    email: string;

    @IsNotEmpty({
        message: 'The password should not be empty.',
    })
    @MinLength (8)
    password: string;
}