import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('auth')
@Serialize(UserDto) // Custom Decorator
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post('signup')
    createUser(@Body() data: CreateUserDto) {
        return this.userService.create(data);
    }

    @Get(':id')
    async findUser(@Param('id') id: number) {
        const user = await this.userService.findOne(id);
        if (!user) { throw new NotFoundException('User Not found') }
        return user;
    }

    @Get()
    async findAllUsers(@Query('email') email: string) {
        const users = await this.userService.find(email);
        if (!users.length) { throw new NotFoundException('User Not found') }
        return users;
    }

    @Patch(':id')
    updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
        return this.userService.update(id, data);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}
