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
exports.Classroom = void 0;
const typeorm_1 = require("typeorm");
const manager_entity_1 = require("../auth/manager/manager.entity");
const student_entity_1 = require("../auth/student/student.entity");
let Classroom = class Classroom {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Classroom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Classroom.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Classroom.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Classroom.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => manager_entity_1.Manager, (manager) => manager.classrooms, {
        eager: false,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", manager_entity_1.Manager)
], Classroom.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Classroom.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_entity_1.Student, (student) => student.classroom),
    __metadata("design:type", Array)
], Classroom.prototype, "students", void 0);
Classroom = __decorate([
    (0, typeorm_1.Entity)()
], Classroom);
exports.Classroom = Classroom;
//# sourceMappingURL=classroom.entity.js.map