import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Manager} from "./manager/manager.entity";

export const GetManager = createParamDecorator((_data, ctx: ExecutionContext): Manager => {
    const req = ctx.switchToHttp().getRequest()
    return req.user
})