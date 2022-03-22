import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { UserDto } from "src/users/dtos/user.dto";

interface ClassConstructor {
    new(...args: any[]): {}
}

export const Serialize = (data: ClassConstructor) => { return UseInterceptors(new SerializeInterceptor(UserDto)) };

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
            })
        );
    }
}
