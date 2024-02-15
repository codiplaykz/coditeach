"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const schools_entity_1 = require("../../schools/schools.entity");
const classroom_entity_1 = require("../../classrooms/classroom.entity");
const role_status_enum_1 = require("../manager/role-status.enum");
let Manager = class Manager {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Manager.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Manager.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Manager.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Manager.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Manager.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Manager.prototype, "schoolId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => schools_entity_1.School, (school) => school.managers),
    __metadata("design:type", schools_entity_1.School)
], Manager.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => classroom_entity_1.Classroom, (classroom) => classroom.manager, {
        eager: true,
    }),
    __metadata("design:type", Array)
], Manager.prototype, "classrooms", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Manager.prototype, "profile_image", void 0);
Manager = __decorate([
    (0, typeorm_1.Entity)()
], Manager);
exports.Manager = Manager;
//# sourceMappingURL=manager.entity.js.map