import { readFile, writeFile } from "fs/promises";

export class MessagesRepository {

    async findOne(id: string): Promise<object> {
        return (await this.readFile())[id];
    }

    async findAll() {
        return await this.readFile();
    }

    async create(content: string) {
        const messages = this.readFile();
        const id = Math.floor(Math.random() * 999);
        messages[id] = { id, content };
        await writeFile('messages.json', JSON.stringify(messages));
    }

    private async readFile(): Promise<object> {
        return JSON.parse(await readFile('messages.json', 'utf-8'));
    }
}
