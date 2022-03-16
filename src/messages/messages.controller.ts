import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {

    constructor(private _messagesService: MessagesService) {}

    @Get()
    listMessages() {
        return this._messagesService.findAll();
    }

    @Post()
    postMessage(@Body() data: CreateMessageDto) {
        return this._messagesService.create(data.content);
    }

    @Get(':id')
    getMessage(@Param('id') id: string) {
        return this._messagesService.findOne(id);
    }
}
