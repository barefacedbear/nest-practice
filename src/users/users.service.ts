import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

    async create(data: CreateUserDto) {
        const user = this.userRepo.create(data); // This is used if we want to execute hook
        return await this.userRepo.save(user);
    }

    async findOne(id: number) {
        if(!id) {
            throw new ForbiddenException('Not Authorized');
        }
        return await this.userRepo.findOne(id)
    }

    async find(email: string) { return await this.userRepo.find({ email }) }

    async update(id: number, data: Partial<User>) {
        // await this.userRepo.update(id, data); // This will update record in single go but wont run the hook
        const user = await this.userRepo.findOne(id);
        if (!user) { throw new NotFoundException('User not found') };
        Object.assign(user, data);
        return await this.userRepo.save(user);
    }

    async remove(id: number) {
        // await this.userRepo.delete(id); // This will delete record in single go but wont run the hook
        const user = await this.userRepo.findOne(id);
        if (!user) { throw new NotFoundException('User not found') };
        return await this.userRepo.remove(user);
    }
}
