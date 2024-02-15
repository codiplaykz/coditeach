import {EntityRepository, Repository} from "typeorm";
import {ConflictException, InternalServerErrorException, Logger} from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import {Manager} from "./manager.entity";
import {CreateManagerDto} from "./dto/create-manager.dto";
import {GetTeachersFilterDto} from "./dto/get-teachers-filter.dto";
import {UpdateManagerDto} from "./dto/update-manager.dto";
import {ManagerRole} from "./role-status.enum";

@EntityRepository(Manager)
export class ManagerRepository extends Repository<Manager> {
    private logger = new Logger('ManagerRepository', true);

    async getManager(email: string) {
        this.logger.debug(`Attempting to get manager with email: ${email}`);

        try {
            const manager = await this.query(
                'SELECT m.id, m.name, m.email, m.password, m.role, m."schoolId", m.profile_image, mv."verificationCode", mv."isVerified", mv."updatedAt", mv."limitCount" FROM manager AS m LEFT JOIN manager_verification AS mv ON m.email = mv.email WHERE m.email=$1',
                [email]
            );

            if (manager) {
                this.logger.debug(`Manager retrieved successfully with email: ${email}`);
            } else {
                this.logger.debug(`No manager found with email: ${email}`);
            }

            return manager;
        } catch (error) {
            this.logger.error(`Failed to get manager with email: ${email}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async getTeachers(filterDto: GetTeachersFilterDto, manager: Manager): Promise<Manager[]> {
        this.logger.debug(`Fetching teachers with filter: ${JSON.stringify(filterDto)} and manager: ${manager.email}`);

        let { schoolId } = filterDto;

        if (!schoolId) {
            schoolId = manager.schoolId;
            this.logger.debug(`No schoolId provided in filter, using manager's schoolId: ${schoolId}`);
        }

        try {
            const rawManagers = await this.query(
                'SELECT m.id, m.name, m.email, m."schoolId", m.role, m.profile_image, mv."isVerified", ' +
                'c.id AS classroom_id, c.title AS classroom_title, c.code AS classroom_code, c."createdAt" AS classroom_createdAt ' +
                'FROM manager AS m ' +
                'INNER JOIN manager_verification AS mv ON m.email = mv.email ' +
                'LEFT JOIN classroom AS c ON m.id = c."managerId" ' +
                'WHERE m."schoolId" = $1 AND m.role = $2;', [schoolId, ManagerRole.TEACHER]);

            const groupedData = {};

            rawManagers.forEach(row => {
                if (!groupedData[row.id]) {
                    groupedData[row.id] = {
                        id: row.id,
                        name: row.name,
                        email: row.email,
                        schoolId: row.schoolId,
                        role: row.role,
                        profile_image: row.profile_image,
                        isVerified: row.isVerified,
                        classrooms: []
                    };
                }

                if (row.classroom_id) {
                    groupedData[row.id].classrooms.push({
                        id: row.classroom_id,
                        title: row.classroom_title,
                        code: row.classroom_code,
                        createdAt: row.classroom_createdAt
                    });
                }
            });

            let resultArray: Manager[] = Object.values(groupedData);
            this.logger.debug(`Fetched ${resultArray.length} teachers successfully`);

            return resultArray;
        } catch (error) {
            this.logger.error(`Failed to get teachers for school ${manager.schoolId}. Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createManager(createManagerDto: CreateManagerDto): Promise<void> {
        const { email, name, school, role, profile_image } = createManagerDto;
        this.logger.debug(`Creating manager with email: ${email}, name: ${name}, school: ${school}, role: ${role}`);

        // Hashing the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createManagerDto.password, salt);
        this.logger.debug(`Password hashed for manager with email: ${email}`);

        const manager = this.create({
            email, name, password: hashedPassword, role, profile_image, schoolId: school.toString()
        });

        try {
            await this.save(manager);
            this.logger.debug(`Manager created successfully with email: ${email}`);
        } catch (error) {
            this.logger.error(`Failed to create manager with email: ${email}`, error.stack);

            if (error.code === '23505') { // Duplicate email
                this.logger.warn(`Attempt to create manager with duplicate email: ${email}`);
                throw new ConflictException('Email already exists');
            }
            if (error.code === '22P02') { // School id incorrect
                this.logger.warn(`Incorrect school id provided for manager with email: ${email}`);
                throw new ConflictException('School id incorrect');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async updateManager(updateManagerDto: UpdateManagerDto) {
        this.logger.debug(`Updating manager with id: ${updateManagerDto.id}`);

        try {
            if (updateManagerDto.password) {
                this.logger.debug(`Hashing new password for manager with id: ${updateManagerDto.id}`);
                const salt = await bcrypt.genSalt();
                updateManagerDto.password = await bcrypt.hash(updateManagerDto.password, salt);
            }

            await this.update(updateManagerDto.id, updateManagerDto);
            this.logger.debug(`Manager with id: ${updateManagerDto.id} updated successfully`);
        } catch (error) {
            this.logger.error(`Failed to update manager with id: ${updateManagerDto.id}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

}