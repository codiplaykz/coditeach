import {EntityRepository, Repository} from "typeorm";
import {School} from "./schools.entity";
import {CreateSchoolDto} from "./dto/create-school.dto";

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
            } else if (row.manager_role === "TEACHER" && !school.teachers.some(m => m.id === row.manager_id)) {
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

@EntityRepository(School)
export class SchoolsRepository extends Repository<School> {
    async createSchool(createSchoolDto: CreateSchoolDto): Promise<School> {
        const { name, country, city } = createSchoolDto;

        const school = this.create({
            name, country, city
        })

        await this.save(school);
        return school;
    }

    async getSchools() {
        // let schools = await this.query('select * from school')
        // if (schools.length !== 0) {
        //     for (let i = 0; i <schools.length; i++) {
        //         // let managers = await this.query('select * from manager')
        //         // let managers = await this.query('select * from manager_verification')
        //         let managers = await this.query('select * from manager where "schoolId"=$1', [schools[i].id])
        //         schools[i].teachers = managers.filter((manager) => manager.role === 'TEACHER')
        //         schools[i].school_admins = managers.filter((manager) => manager.role === 'SCHOOL_ADMIN')
        //     }
        // }
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
        `)

        // Transform the data
        const groupedData = transformSchoolData(rawSchools);
        return groupedData
    }
}


