"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolsRepository = void 0;
const typeorm_1 = require("typeorm");
const schools_entity_1 = require("./schools.entity");
function transformSchoolData(rawData) {
    const schools = [];
    const schoolMap = new Map();
    rawData.forEach((row) => {
        let school = schoolMap.get(row.school_id);
        if (!school) {
            school = {
                id: row.school_id,
                name: row.school_name,
                country: row.school_country,
                city: row.school_city,
                schoolAdmins: [],
                teachers: [],
                classrooms: [],
                students: []
            };
            schoolMap.set(row.school_id, school);
            schools.push(school);
        }
        if (row.manager_id) {
            const manager = {
                id: row.manager_id,
                name: row.manager_name,
                email: row.manager_email,
                role: row.manager_role
            };
            if (row.manager_role === "SCHOOL_ADMIN" && !school.schoolAdmins.some(m => m.id === row.manager_id)) {
                school.schoolAdmins.push(manager);
            }
            else if (row.manager_role === "TEACHER" && !school.teachers.some(m => m.id === row.manager_id)) {
                school.teachers.push(manager);
            }
        }
        if (row.classroom_id && !school.classrooms.some(c => c.id === row.classroom_id)) {
            school.classrooms.push({
                id: row.classroom_id,
                title: row.classroom_title,
                code: row.classroom_code
            });
        }
        if (row.student_id && !school.students.some(s => s.id === row.student_id)) {
            school.students.push({
                id: row.student_id,
                name: row.student_name,
                accountId: row.student_account_id,
            });
        }
    });
    return schools;
}
let SchoolsRepository = class SchoolsRepository extends typeorm_1.Repository {
    async createSchool(createSchoolDto) {
        const { name, country, city } = createSchoolDto;
        const school = this.create({
            name, country, city
        });
        await this.save(school);
        return school;
    }
    async getSchools() {
        let rawSchools = await this.query(`
        SELECT 
            school.id AS school_id,
            school.name AS school_name,
            school.country AS school_country,
            school.city AS school_city,
            manager.id AS manager_id,
            manager.name AS manager_name,
            manager.email AS manager_email,
            manager.role AS manager_role,
            classroom.id AS classroom_id,
            classroom.title AS classroom_title,
            classroom.code AS classroom_code,
            student.id AS student_id,
            student.name AS student_name,
            student."accountId" AS student_account_id
        FROM
            School
        LEFT JOIN manager ON school.id = manager."schoolId"
        LEFT JOIN classroom ON manager.id = classroom."managerId"
        LEFT JOIN student ON classroom.id = student."classroomId"
        `);
        const groupedData = transformSchoolData(rawSchools);
        return groupedData;
    }
};
SchoolsRepository = __decorate([
    (0, typeorm_1.EntityRepository)(schools_entity_1.School)
], SchoolsRepository);
exports.SchoolsRepository = SchoolsRepository;
//# sourceMappingURL=schools.repository.js.map