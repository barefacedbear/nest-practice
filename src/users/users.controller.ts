import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './users.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('auth')
@Serialize(UserDto) // Custom Decorator
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {

    constructor(private _userService: UsersService, private _authService: AuthService) { }

    // @Get('color/:color')
    // setColor(@Param('color') color: string, @Session() session: any) {
    //     session.color = color;
    // }

    // @Get('color')
    // getColor(@Session() session: any) {
    //     return session.color;
    // }

    @Post('signup')
    async createUser(@Body() data: CreateUserDto, @Session() session: any) {
        const user = await this._authService.signup(data);
        session.userId = user.id;
        return user;
    }

    @Get('whoami')
    @UseGuards(AuthGuard)
    // whoAmI(@Session() session: any) {
    //     return this._userService.findOne(session.userId);
    // }
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('signin')
    async signin(@Body() data: CreateUserDto, @Session() session: any) {
        const user = await this._authService.signin(data);
        session.userId = user.id;
        return user;
    }

    @Get('signout')
    signout(@Session() session: any) { session.userId = null; }

    @Get(':id')
    async findUser(@Param('id') id: number) {
        const user = await this._userService.findOne(id);
        if (!user) { throw new NotFoundException('User Not found') }
        return user;
    }

    @Get()
    async findAllUsers(@Query('email') email: string) {
        const users = await this._userService.find(email);
        if (!users.length) { throw new NotFoundException('User Not found') }
        return users;
    }

    @Patch(':id')
    updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
        return this._userService.update(id, data);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this._userService.remove(id);
    }
}
