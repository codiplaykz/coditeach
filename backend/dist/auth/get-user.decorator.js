"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetManager = void 0;
const common_1 = require("@nestjs/common");
exports.GetManager = (0, common_1.createParamDecorator)((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
//# sourceMappingURL=get-user.decorator.js.map