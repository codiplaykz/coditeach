import { Repository } from "typeorm";
import { Manager } from "./manager.entity";
import { CreateManagerDto } from "./dto/create-manager.dto";
import { GetTeachersFilterDto } from "./dto/get-teachers-filter.dto";
import { UpdateManagerDto } from "./dto/update-manager.dto";
export declare class ManagerRepository extends Repository<Manager> {
    private logger;
    getManager(email: string): Promise<any>;
    getTeachers(filterDto: GetTeachersFilterDto, manager: Manager): Promise<Manager[]>;
    createManager(createManagerDto: CreateManagerDto): Promise<void>;
    updateManager(updateManagerDto: UpdateManagerDto): Promise<void>;
}
