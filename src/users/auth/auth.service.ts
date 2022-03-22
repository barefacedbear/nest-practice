import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private _userService: UsersService) { }

    async signup(data: CreateUserDto) {
        const users = await this._userService.find(data.email);
        if (users.length) { throw new BadRequestException('Email in use') }

        const salt = randomBytes(16).toString('hex');
        const hash = <Buffer>(await scrypt(data.password, salt, 32));
        return await this._userService.create({ email: data.email, password: `${salt}.${hash.toString('hex')}` });
    }

    async signin(data: CreateUserDto) {
        const [user] = await this._userService.find(data.email);
        if (!user) { throw new NotFoundException('Incorrect email') }

        const [salt, storedHash] = user.password.split('.');
        const hash = <Buffer>(await scrypt(data.password, salt, 32));

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Incorrect Password')
        }
        return user;
    }
}
