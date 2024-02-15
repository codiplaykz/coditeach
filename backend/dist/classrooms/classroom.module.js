"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomModule = void 0;
const common_1 = require("@nestjs/common");
const classroom_service_1 = require("./classroom.service");
const classroom_controller_1 = require("./classroom.controller");
const typeorm_1 = require("@nestjs/typeorm");
const classroom_repository_1 = require("./classroom.repository");
const auth_module_1 = require("../auth/auth.module");
let ClassroomModule = class ClassroomModule {
};
ClassroomModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([classroom_repository_1.ClassroomRepository]), auth_module_1.AuthModule],
        controllers: [classroom_controller_1.ClassroomController],
        providers: [classroom_service_1.ClassroomService]
    })
], ClassroomModule);
exports.ClassroomModule = ClassroomModule;
//# sourceMappingURL=classroom.module.js.map